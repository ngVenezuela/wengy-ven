const fetch = require('node-fetch');

const messages = require('./../../config/messages');
const config = require('./../../config/config.js');
const sendMessage = require('./../utils/send-message');
const generateRandom = require('./../utils/time').generateRandom;
const commandUtility = require('./../utils/command');

const checkGoodMorning = (goodMorningGivenToday, text) =>
  !goodMorningGivenToday && config.goodMorningRegExp.test(text);

const checkForCode = (bot, msgContext, redisClient) => {
  commandUtility.verifyCommand(redisClient, '/gist', msgContext.from.id)
    .then((canExecuteCommand) => {
      if (canExecuteCommand) {
        if (!Object.prototype.hasOwnProperty.call(msgContext, 'entities')) {
          return;
        }

        if (msgContext.entities[0].type !== 'pre') {
          return;
        }

        if (msgContext.text.length >= 200) {
          return;
        }

        const chatId = msgContext.chat.id;
        const { firstName = '', lastName = '', username = '' } = msgContext.from;
        const fullName = firstName === '' && lastName === '' ? '' : `${firstName} ${lastName} `;
        const user = username === '' ? '' : `(@${username})`;
        const filename = `${new Date().toISOString()}.js`;
        const gist = msgContext.text;

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
            sendMessage(bot, chatId, html_url, true, msgContext.message_id);
          }).catch(() => { });
      }
    })
    .catch(() => { });
};

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
  sayGoodbye,
  checkGoodMorning,
  checkForCode
};

