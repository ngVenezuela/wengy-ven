const { githubOpenVeLink } = require('config/messages');
const { sendMessage } = require('bot-api-overrides');

const sendOpenVeGithubLink = (bot, msg) =>
  sendMessage(bot, msg.chat.id, githubOpenVeLink);

module.exports = {
  sendOpenVeGithubLink,
};
