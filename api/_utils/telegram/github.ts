import fetch from "node-fetch";

import messages from "../messages";
import { sendMessage } from "./bot-methods";
import { getChatType } from "./admin";
import { Message } from "./interfaces";

const { GITHUB_ACCESS_TOKEN } = process.env;
const MAX_LENGTH_GIST_TEXT = 400;

export const sendCommunityRepo = async (chatId: number) =>
  sendMessage({
    chatId,
    text: "https://github.com/ngVenezuela/wengy-ven"
  });

export const sendGist = async (message: Message, code: string) => {
  if (code === "") {
    return;
  }

  if (!message.from) {
    return;
  }

  const chatId = message.chat.id;
  const {
    first_name: firstName = "",
    last_name: lastName = "",
    username = ""
  } = message.from;
  const fullName =
    firstName === "" && lastName === "" ? "" : `${firstName} ${lastName} `;
  const user = username === "" ? "" : `(@${username})`;
  const filename = `${new Date().toISOString()}.js`;

  const body = {
    description: messages.gistCreated
      .replace("#{fullName}", fullName)
      .replace("#{user}", user),
    public: true,
    files: {
      [filename]: {
        content: code
      }
    }
  };

  const response = await fetch("https://api.github.com/gists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `token ${GITHUB_ACCESS_TOKEN}`
    },
    body: JSON.stringify(body)
  });
  const jsonResponse = await response.json();
  const { html_url: link } = jsonResponse;

  await sendMessage({
    chatId,
    text: link,
    replyToMessageId: message.message_id
  });
};

export const verifyCode = async (message: Message) => {
  const type = await getChatType(message);

  if (type === "main" && message.entities && message.text) {
    if (!Object.prototype.hasOwnProperty.call(message, "entities")) {
      return;
    }

    if (message.entities[0].type !== "pre") {
      return;
    }

    if (message.text.length >= MAX_LENGTH_GIST_TEXT) {
      await sendMessage({
        chatId: message.chat.id,
        text: messages.gistRecommendation,
        replyToMessageId: message.message_id
      });
    } else {
      await sendGist(message, message.text);
    }
  }
};
