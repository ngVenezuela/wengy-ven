const { welcome, goodBye } = require('config/messages');
const { sendMessage } = require('bot-api-overrides');
const { chatType } = require('listen-commands/admin');
/**
 * Returns username or first name of the user
 * @param {string} firstName
 * @param {string} userName
 * @return {string}
 */
const formatName = (firstName, userName) =>
  userName ? '@'.concat(userName) : firstName;

/**
 * Say hello to new members of the group
 * @param {object} bot
 * @param {object} msg
 */
const sayHello = async (bot, msg) => {
  const type = await chatType(bot, msg);
  if (type === 'main') {
    msg.new_chat_members.forEach(({ first_name, username }) => {
      const message = welcome.replace(
        '#{name}',
        formatName(first_name, username)
      );

      sendMessage(bot, msg.chat.id, message, {
        reply_to_message_id: msg.message_id,
      });
    });
  }
};

/**
 * Say goodbye to ex-members of the group
 * @param {object} bot
 * @param {object} msg
 */
const sayGoodbye = async (bot, msg) => {
  const {
    left_chat_member: { first_name: firstName },
    chat: { id: chatId },
  } = msg;
  const type = await chatType(bot, msg);
  if (type === 'main') {
    sendMessage(bot, chatId, goodBye.replace('#{name}', firstName));
  }
};

module.exports = {
  sayHello,
  sayGoodbye,
};
