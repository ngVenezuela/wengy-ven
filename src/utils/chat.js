const messages = require('./../../config/messages');
const sendMessage = require('./../utils/message').sendMessage;
const generateRandom = require('./../utils/time').generateRandom;

const formatName = (firstName, userName) => (userName ? '@'.concat(userName) : firstName);

const sayHello = (bot, msg) => {
  sendMessage(
    bot,
    msg.chat.id,
    messages.welcome.replace(
      '#{name}',
      formatName(msg.new_chat_member.first_name, msg.new_chat_member.username)
    ),
    true,
    msg.message_id
  );
};

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

