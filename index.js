var TelegramBot = require('node-telegram-bot-api');
var config = require ('./config');

var token = config.telegramToken;
var bot = new TelegramBot(token, {polling: true});

try {
  bot.on('new_chat_participant', function(msg) {
    console.log('msg: ', msg);
    bot.sendMessage(
      msg.chat.id,
      getFullWelcomeMsg(msg),
      {reply_to_message_id: msg.message_id, parse_mode: 'Markdown'}
    );

    function getFullWelcomeMsg(msg) {
      var nameToBeShown = msg.new_chat_member.first_name;
      if (msg.new_chat_member.username) {
        nameToBeShown = '@' + msg.new_chat_member.username;
      } else if (msg.new_chat_member.hasOwnProperty('last_name')) {
        nameToBeShown = nameToBeShown + ' ' + msg.new_chat_member.last_name;
      }
      return config.welcomeMsg.replace('#{name}', nameToBeShown);
    }
  });
} catch (e) {
  console.log('exception: ', e.result);
}
