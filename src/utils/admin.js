const groupId = require('./../../config/config').community.telegram.groupId;
const adminGroupId = require('./../../config/config').community.telegram.adminGroupId;
const whiteListedDomains = require('./../../config/config').whiteListedDomains;
const commandUtility = require('./command');
const forwardMessage = require('./message').forwardMessage;

/**
 * Verify that is a valid url and post that url in admin group
 * @param {object} bot
 * @param {object} msg
 * @param {object} redisClient
 */
const verifyAndSendUrl = (bot, msg, redisClient) => {
  if (
    msg.entities &&
    msg.entities.filter(entity => entity.type === 'url').length > 0
  ) {
    const entities = msg.entities.filter(msgEntity => msgEntity.type === 'url');
    const urls = entities.map(entity =>
      msg.text.slice(entity.offset, entity.length + entity.offset).replace('https://www.', 'https://')
    );

    const arePostedUrlsPermitted =
      urls
        .every(url =>
          whiteListedDomains
            .some(whiteListedDomain => new RegExp(`^${whiteListedDomain}`).test(url)));

    if (arePostedUrlsPermitted) {
      commandUtility.verifyCommand(redisClient, '/url-to-admins', msg.from.id)
        .then((canExecuteCommand) => {
          if (canExecuteCommand) {
            forwardMessage(
              bot,
              adminGroupId,
              msg.chat.id,
              msg.message_id
            );
          }
        });
    }
  }
};

/**
 * Execute a callback function depending on what type of chat it is
 * @param {object} msg
 * @param {function} cb
 * @param {boolean} mainGroup
 * @param {boolean} adminGroup
 * @param {boolean} privateChat
 */
const verifyGroup = (msg, cb, mainGroup = true, adminGroup = false, privateChat = false) => {
  if (mainGroup && msg.chat.type === 'group' && msg.chat.id.toString() === groupId) {
    return cb();
  }

  if (adminGroup && msg.chat.type === 'group' && msg.chat.id.toString() === adminGroupId) {
    return cb();
  }

  if (privateChat && msg.chat.type === 'private') {
    return cb();
  }

  return null;
};

module.exports = {
  verifyAndSendUrl,
  verifyGroup
};
