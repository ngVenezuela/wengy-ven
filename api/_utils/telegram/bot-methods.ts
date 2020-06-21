import fetch from "node-fetch";

import { Chat, Message } from "./interfaces";

const { TELEGRAM_BOT_TOKEN } = process.env;
const TELEGRAM_BASE_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/`;

interface ForwardMessageProps {
  chatId: Chat["id"];
  fromChatId: Chat["id"];
  messageId: Message["message_id"];
  disableNotification?: boolean;
}

interface SendMessageProps {
  chatId: Chat["id"];
  text: Message["text"];
  disableNotification?: boolean;
  disableWebPagePreview?: boolean;
  parseMode?: string;
  replyMarkup?: object;
  replyToMessageId?: Message["message_id"];
}

const sendTypingAction = async (chatId: string | number) => {
  await fetch(
    `${TELEGRAM_BASE_URL}sendChatAction?chat_id=${chatId}&action=typing`
  );
};

export const forwardMessage = async ({
  chatId: chat_id,
  fromChatId: from_chat_id,
  messageId: message_id,
  disableNotification: disable_notification = false
}: ForwardMessageProps) => {
  await sendTypingAction(chat_id);

  await fetch(`${TELEGRAM_BASE_URL}forwardMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message_id,
      chat_id,
      from_chat_id,
      disable_notification
    })
  });
};

export const sendMessage = async ({
  chatId: chat_id,
  text,
  disableNotification: disable_notification = false,
  disableWebPagePreview: disable_web_page_preview = false,
  parseMode: parse_mode = "Markdown",
  replyMarkup: reply_markup,
  replyToMessageId: reply_to_message_id
}: SendMessageProps) => {
  await sendTypingAction(chat_id);

  await fetch(`${TELEGRAM_BASE_URL}sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id,
      text,
      parse_mode,
      disable_web_page_preview,
      disable_notification,
      reply_to_message_id,
      reply_markup
    })
  });
};
