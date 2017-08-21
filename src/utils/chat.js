const messages = require('./../../config/messages');
const sendMessage = require('./../utils/message').sendMessage;
const generateRandom = require('./../utils/time').generateRandom;

/**
 * Returns username or first name of the user
 * @param {string} firstName
 * @param {string} userName
 * @return {string}
 */
const formatName = (firstName, userName) => (userName ? '@'.concat(userName) : firstName);

/**
 * Say hello to new members of the group
 * @param {object} bot
 * @param {object} msg
 */
const sayHello = (bot, msg) => {
  msg.new_chat_members.forEach(newChatMember =>
    sendMessage(
      bot,
      msg.chat.id,
      messages.welcome.replace(
        '#{name}',
        formatName(newChatMember.first_name, newChatMember.username)
      ),
      true,
      msg.message_id
    )
  );
};

/**
 * Say goodbye to ex-members of the group
 * @param {object} bot
 * @param {object} msg
 */
const sayGoodbye = (bot, msg) => {
  const randomIndex = generateRandom(0, messages.goodByes.length - 1);

  sendMessage(
    bot,
    msg.chat.id,
    messages.goodByes[randomIndex].replace(
      '#{name}',
      formatName(msg.left_chat_member.first_name, msg.left_chat_member.username)
    ),
    true,
    msg.message_id
  );
};

module.exports = {
  sayHello,
  sayGoodbye
};

