const Sentry = require('@sentry/node');

const { sayHello, sayGoodbye } = require('./greetings');
const { sendGroupId } = require('./development-tools');
const { sendOpenVeGithubLink } = require('./community');
const { sendCommunityRepo, sendGist, verifyCode } = require('./github');
const { verifyUrls } = require('./admin');
const { verifyResponse } = require('./dialogflow');

const handleListenCommands = bot => {
  /**
   * Check for /comunidades text command
   */
  bot.onText(/^\/comunidades/, msg => sendOpenVeGithubLink(bot, msg));

  /**
   * Check for /gist command with parameters
   */
  bot.onText(/^\/gist ([\s\S\.]+)/, (msg, match) =>
    sendGist(bot, msg, match[1])
  );

  /**
   * Check for /github text command
   */
  bot.onText(/^\/github/, msg => sendCommunityRepo(bot, msg));

  /**
   * Check for /groupId text command
   */
  bot.onText(/^\/groupId/, msg => sendGroupId(bot, msg));

  /**
   * Triggered when new member(s) join
   */
  bot.on('new_chat_members', msg => sayHello(bot, msg));

  /**
   * Triggered when a member leaves
   */
  bot.on('left_chat_member', msg => sayGoodbye(bot, msg));

  bot.on('message', msg => {
    /**
     * Verify urls to send to admins
     */
    verifyUrls(bot, msg);
    /**
     * Verify code to convert or to suggest using /gist command
     */
    verifyCode(bot, msg);
    /**
     * On any message check if dialogflow has a response to the message
     */
    verifyResponse(bot, msg);
  });

  bot.on('webhook_error', error => {
    Sentry.captureException(error);
  });
};

module.exports = handleListenCommands;
