const {
  whiteListedDomains,
  mainGroupId,
  adminGroupId,
} = require('config/telegram');
const { forwardMessage } = require('bot-api-overrides');

const chatType = async (bot, msg) => {
  const {
    chat: { id },
  } = msg;
  const { id: chatId } = await bot.getChat(id);

  if (chatId.toString() === mainGroupId) {
    return 'main';
  } else if (chatId.toString() === adminGroupId) {
    return 'admin';
  }

  return 'private';
};

const verifyUrls = async (bot, msg) => {
  const type = await chatType(bot, msg);

  if (type === 'main') {
    const urlEntities = msg.entities
      ? msg.entities.filter(entity => entity.type === 'url')
      : [];
    if (urlEntities.length > 0) {
      const urls = urlEntities.map(entity =>
        msg.text
          .slice(entity.offset, entity.length + entity.offset)
          .replace('https://www.', 'https://')
      );

      const arePostedUrlsPermitted = urls.every(url =>
        whiteListedDomains.some(whiteListedDomain =>
          new RegExp(`^${whiteListedDomain}`).test(url)
        )
      );

      if (arePostedUrlsPermitted) {
        forwardMessage(bot, adminGroupId, msg.chat.id, msg.message_id);
      }
    }
  }
};

module.exports = {
  chatType,
  verifyUrls,
};
