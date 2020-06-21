import config from "../config";
import { forwardMessage, sendMessage } from "./bot-methods";
import { Chat, Message } from "./interfaces";

const { MAIN_GROUP_ID, ADMIN_GROUP_ID } = process.env;

export const getChatType = async (message: Message) => {
  const {
    chat: { id: chatId }
  } = message;

  if (chatId.toString() === MAIN_GROUP_ID) {
    return "main";
  }

  if (chatId.toString() === ADMIN_GROUP_ID) {
    return "admin";
  }

  return "private";
};

/**
 * Send main or admin's group id.
 * This will be used in your .env
 */
export const sendGroupId = async ({ id: chatId, type }: Chat) => {
  if (["group", "supergroup"].includes(type)) {
    await sendMessage({
      chatId,
      text: `Tú variable \`mainGroupId/adminGroupId\` es: ${chatId}`
    });
  }
};

export const verifyUrls = async (message: Message) => {
  const type = await getChatType(message);

  if (message.text && type === "main") {
    const urlEntities = message.entities
      ? message.entities.filter(entity => entity.type === "url")
      : [];
    if (urlEntities.length > 0) {
      const urls = urlEntities.map(entity =>
        message
          .text!.slice(entity.offset, entity.length + entity.offset)
          .replace("https://www.", "https://")
      );

      const arePostedUrlsPermitted = urls.every(url =>
        config.whiteListedDomains.some(whiteListedDomain =>
          new RegExp(`^${whiteListedDomain}`).test(url)
        )
      );

      if (arePostedUrlsPermitted && ADMIN_GROUP_ID) {
        await forwardMessage({
          chatId: Number(ADMIN_GROUP_ID),
          fromChatId: message.chat.id,
          messageId: message.message_id
        });
      }
    }
  }
};
