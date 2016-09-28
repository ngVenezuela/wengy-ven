const telegramBot = require('node-telegram-bot-api');
const config =  require('../config/config');
const messages =  require('../config/messages');
const winston = require('winston');

const token = config.telegramToken;
const bot = new telegramBot(token, {polling: true});
winston
  .add(winston.transports.File, { filename: 'logs/debug.log' })
  .remove(winston.transports.Console);

try {
  bot.on('new_chat_participant', (msg) => {
    winston.log('debug', 'msg: ', {data: msg});
    bot.sendMessage(
      msg.chat.id,
      getFullWelcomeMsg(msg),
      {reply_to_message_id: msg.message_id, parse_mode: 'Markdown'}
    );

    function getFullWelcomeMsg(msg) {
      let nameToBeShown = msg.new_chat_member.first_name;
      if (msg.new_chat_member.username) {
        nameToBeShown = '@' + msg.new_chat_member.username;
      } else if (msg.new_chat_member.hasOwnProperty('last_name')) {
        nameToBeShown = nameToBeShown + ' ' + msg.new_chat_member.last_name;
      }
      return messages.welcomeMsg.replace('#{name}', nameToBeShown);
    }
  });
} catch (e) {
  winston.log('debug', 'exception found: ', {data: e});
}
