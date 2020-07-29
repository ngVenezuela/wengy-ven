import crypto from "crypto";
import { Buffer } from "buffer";
import * as Sentry from "@sentry/node";
import { NowRequest, NowResponse } from "@vercel/node";

import { sendMessage } from "../_utils/telegram/bot-methods";
import messages from "../_utils/messages";

const {
  TWITTER_CONSUMER_SECRET,
  MAIN_GROUP_ID,
  NODE_ENV,
  SENTRY_DSN
} = process.env;

// taken from https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/tweet-object
interface TweetInterface {
  in_reply_to_status_id: number;
  id_str: string;
  text: string;
  user: {
    screen_name: string;
  };
  retweeted_status: {
    text: string;
  };
}

Sentry.init({ dsn: SENTRY_DSN });

const isReply = (tweet: TweetInterface): boolean =>
  tweet.in_reply_to_status_id !== undefined;

const isRt = (tweet: TweetInterface): boolean =>
  tweet.retweeted_status !== undefined;

const handleTweets = async (tweets: TweetInterface[] = []) => {
  const promises: Promise<void>[] = [];
  tweets.forEach(tweet => {
    if (MAIN_GROUP_ID && !isReply(tweet) && !isRt(tweet)) {
      const tweetUrl = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;

      const promise = sendMessage({
        chatId: Number(MAIN_GROUP_ID),
        text: messages.newTweet
          .replace("#{tweetText}", tweet.text)
          .replace("#{tweetUrl}", tweetUrl)
      });

      promises.push(promise);
    }
  });

  await Promise.all(promises);
};

/**
 * @description Used to verify that the request comes from Twitter
 * @see https://github.com/twitterdev/autohook/blob/eac07b9c0bdb8fe3fad375ce5349b0c4c6d1e128/index.js#L78
 */
const validateSignature = (headers: { [index: string]: any }, body: Buffer) => {
  const signatureHeaderName = "x-twitter-webhooks-signature";

  if (typeof headers[signatureHeaderName] === "undefined") {
    throw new TypeError(
      `validateSignature: header ${signatureHeaderName} not found`
    );
  }

  const signature = `sha256=${crypto
    .createHmac("sha256", TWITTER_CONSUMER_SECRET ?? "")
    .update(body)
    .digest("base64")}`;

  return crypto.timingSafeEqual(
    Buffer.from(headers[signatureHeaderName]),
    Buffer.from(signature)
  );
};

/**
 * Generate hash to validate twitter webhook
 * @see https://developer.twitter.com/en/docs/accounts-and-users/subscribe-account-activity/guides/securing-webhooks.html
 */
const getChallengeResponse = (crcToken: string) =>
  crypto
    .createHmac("sha256", TWITTER_CONSUMER_SECRET ?? "")
    .update(crcToken)
    .digest("base64");

const getRawBody = (readable: NowRequest): Promise<Buffer> => {
  const chunks: any[] = [];
  let bytes = 0;

  return new Promise((resolve, reject) => {
    readable.on("error", reject);

    readable.on("data", chunk => {
      chunks.push(chunk);
      bytes += chunk.length;
    });

    readable.on("end", () => {
      resolve(Buffer.concat(chunks, bytes));
    });
  });
};

export default async (request: NowRequest, response: NowResponse) => {
  try {
    /*
      There was a problem when validating the header signature in a get request,
      therefore, we are not validating that here. The problem is related to the
      order of the query arguments being reversed in vercel, but not with a local
      environment (ngrok).
    */
    if (request.method === "GET") {
      const crcToken = request.query.crc_token.toString();

      if (crcToken) {
        const hash = getChallengeResponse(crcToken);

        response.status(200).json({
          response_token: `sha256=${hash}`
        });
      } else {
        response.status(400).send("crc_token missing from request");
      }
    } else if (request.method === "POST") {
      const rawBody = await getRawBody(request);

      if (validateSignature(request.headers, rawBody)) {
        const newTweets = request.body.tweet_create_events;
        await handleTweets(newTweets);

        response.status(200).send("ok");
      } else {
        response.status(400).send("signature is not valid");
      }
    } else {
      response.status(401).send("Error: Unauthorized");
    }
  } catch (error) {
    if (NODE_ENV === "development") {
      console.error(error);
    } else {
      Sentry.captureException(error);
    }

    response.status(400).send("not ok");
  }
};
