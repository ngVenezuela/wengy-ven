import dialogflow from "@google-cloud/dialogflow";

import { sendMessage } from "./bot-methods";
import { Message, Entity } from "./interfaces";

const {
  BOT_USERNAME,
  DIALOGFLOW_CLIENT_EMAIL,
  DIALOGFLOW_PRIVATE_KEY,
  DIALOGFLOW_PROJECT_ID
} = process.env;

const isBotReply = (message: Message) =>
  message.reply_to_message?.from?.username === BOT_USERNAME;

const wasBotMentioned = (entities: Entity[], text: string) =>
  entities.find(entity => entity.type === "mention") &&
  text.includes(`@${BOT_USERNAME}`);

const getTextResponse = (message: Message) => {
  if (
    message.entities &&
    message.text &&
    wasBotMentioned(message.entities, message.text)
  ) {
    return message.text.replace(`@${BOT_USERNAME}`, "");
  }
  if (isBotReply(message) || message.chat.type === "private") {
    return message.text;
  }

  return "";
};

const query = async (message: Message) => {
  const text = getTextResponse(message);

  if (
    DIALOGFLOW_CLIENT_EMAIL &&
    DIALOGFLOW_PRIVATE_KEY &&
    DIALOGFLOW_PROJECT_ID &&
    message.from
  ) {
    const privateKeyWithActualNewLines = DIALOGFLOW_PRIVATE_KEY.replace(
      /\\n/g,
      "\n"
    );

    const config = {
      credentials: {
        private_key: privateKeyWithActualNewLines,
        client_email: DIALOGFLOW_CLIENT_EMAIL
      }
    };
    const sessionClient = new dialogflow.SessionsClient(config);
    const sessionPath = sessionClient.projectAgentSessionPath(
      DIALOGFLOW_PROJECT_ID,
      message.from.id.toString()
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
          languageCode: "es"
        }
      }
    };
    const [response] = await sessionClient.detectIntent(request);

    if (response.queryResult && response.queryResult.fulfillmentText) {
      await sendMessage({
        chatId: message.chat.id,
        text: response.queryResult.fulfillmentText,
        replyToMessageId: message.message_id
      });
    }
  }
};

const verifyResponse = async (message: Message) => {
  if (message.text) {
    const isNotACommand = !/^\//.test(message.text);

    if (isNotACommand) {
      await query(message);
    }
  }
};

export default verifyResponse;
