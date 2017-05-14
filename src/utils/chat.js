const fetch = require('node-fetch');

const messages = require('./../../config/messages');
const config = require('./../../config/config.js');
const sendMessage = require('./../utils/send-message');
const generateRandom = require('./../utils/time').generateRandom;

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
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body)
  })
  .then(response => response.json())
  .then(({ html_url }) => {
    sendMessage(bot, chatId, html_url, true, msg.message_id);
  }).catch(() => {});
}

function formatName(msgContext) {
  return msgContext.username
    ? '@'.concat(msgContext.username)
    : msgContext.first_name;
}

function sayHello(bot, msg) {
  sendMessage(
    bot,
    msg.chat.id,
    messages.welcome.replace(
      '#{name}',
      formatName(msg.new_chat_member)
    ),
    true,
    msg.message_id
  );
}

function sayGoodbye(bot, msg) {
  const randomIndex = generateRandom(0, messages.goodByes.length - 1);

  sendMessage(
    bot,
    msg.chat.id,
    messages.goodByes[randomIndex].replace(
      '#{name}',
      formatName(msg.left_chat_member)
    ),
    true,
    msg.message_id
  );
}

module.exports = {
  sayHello,
  sayGoodbye,
  checkGoodMorning,
  checkForCode
};

