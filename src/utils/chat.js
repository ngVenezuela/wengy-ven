const fetch = require('node-fetch');

const messages = require('./../../config/messages');
const config = require('./../../config/config.js');

function checkGoodMorning(goodMorningGivenToday, text) {
  return !goodMorningGivenToday && config.goodMorningRegExp.test(text);
}

function checkForCode(bot, msg) {
  if (!Object.prototype.hasOwnProperty.call(msg, 'entities')) {
    return;
  }

  if (msg.entities[0].type !== 'pre') {
    return;
  }

  if (msg.text.length >= 200) {
    return;
  }

  const chatId = msg.chat.id;
  const { firstName = '', lastName = '', username = '' } = msg.from;
  const fullName = firstName === '' && lastName === '' ? '' : `${firstName} ${lastName} `;
  const user = username === '' ? '' : `(@${username})`;
  const filename = `${new Date().toISOString()}.js`;
  const gist = msg.text;

  const body = {
    description: 'gist creado por '.concat(fullName).concat(user).concat(
      ' para https://t.me/ngvenezuela con https://github.com/ngVenezuela/wengy-ven'),
    public: true,
    files: {
      [filename]: {
        content: gist
      }
    }
  };

  fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })
  .then(response => response.json())
  .then(({ html_url }) => {
    bot.sendMessage(chatId, html_url);
  }).catch(() => {});
}

function formatName(msgContext) {
  return msgContext.username
    ? '@'.concat(msgContext.username)
    : msgContext.first_name;
}

function sayHello(bot, msg) {
  bot.sendMessage(
    msg.chat.id,
    messages.welcomeMsg.replace('#{name}', formatName(msg.new_chat_member)),
    { reply_to_message_id: msg.message_id, parse_mode: 'Markdown' }
  );
}

function sayGoodbye(bot, msg) {
  bot.sendMessage(
    msg.chat.id,
    messages.goodbyeMsg.replace('#{name}', formatName(msg.left_chat_member)),
    { reply_to_message_id: msg.message_id, parse_mode: 'Markdown' }
  );
}

module.exports = {
  sayHello,
  sayGoodbye,
  checkGoodMorning,
  checkForCode
};

