const { whiteListedDomains, adminGroupId } = require('config/telegram');
const { forwardMessage } = require('bot-api-overrides');

const verifyUrls = async (bot, msg) => {
  const chatId = msg.chat.id;
  const chatInfo = await bot.getChat(chatId);

  if (chatInfo.type === 'group') {
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
  verifyUrls,
};
