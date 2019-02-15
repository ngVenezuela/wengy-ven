const { Buffer } = require('buffer');
const dialogflow = require('dialogflow');
const { sendMessage } = require('bot-api-overrides');

const {
  DIALOGFLOW_CLIENT_EMAIL,
  DIALOGFLOW_PRIVATE_KEY,
  DIALOGFLOW_PROJECT_ID,
  BOT_USERNAME,
  NODE_ENV,
} = process.env;

/**
 * Verify that dialogflow has a valid
 * response to the query
 * @param {object} response
 */
const dialogFlowHasResponse = response =>
  response.queryResult && response.queryResult.fulfillmentText !== '';

/**
 * Verify that the message is a reply to the bot itself
 * @param {object} msg
 */
const botHasReplies = msg =>
  Object.prototype.hasOwnProperty.call(msg, 'reply_to_message') &&
  msg.reply_to_message.from.username === BOT_USERNAME;

/**
 * Verify that the bot was mentioned in a text
 * @param {array} entities
 * @param {string} text
 */
const botWasMentioned = (entities, text) =>
  entities &&
  entities.findIndex(entity => entity.type === 'mention') > -1 &&
  text.includes(`@${BOT_USERNAME}`);

/**
 * Makes a http request to dialogflow with a query
 * @param {object} bot
 * @param {string} queryString
 * @param {object} msg
 */
const query = async (bot, queryString, msg) => {
  try {
    if (
      DIALOGFLOW_CLIENT_EMAIL &&
      DIALOGFLOW_PRIVATE_KEY &&
      DIALOGFLOW_PROJECT_ID
    ) {
      const privateKey =
        NODE_ENV === 'development'
          ? DIALOGFLOW_PRIVATE_KEY
          : Buffer.from(DIALOGFLOW_PRIVATE_KEY, 'base64').toString();
      const config = {
        credentials: {
          private_key: privateKey,
          client_email: DIALOGFLOW_CLIENT_EMAIL,
        },
      };
      const sessionClient = new dialogflow.SessionsClient(config);
      const sessionPath = sessionClient.sessionPath(
        DIALOGFLOW_PROJECT_ID,
        `${msg.from.id}`
      );
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: queryString,
            languageCode: 'es',
          },
        },
      };
      const [response] = await sessionClient.detectIntent(request);
      if (dialogFlowHasResponse(response)) {
        sendMessage(bot, msg.chat.id, response.queryResult.fulfillmentText, {
          reply_to_message_id: msg.message_id,
        });
      }
    }
  } catch (error) {
    Sentry.captureException(error);
  }
};

/**
 * Method that returns a text depending if it's a reply/mention/private message
 * @param {object} msg
 */
const getTextResponse = msg => {
  if (botWasMentioned(msg.entities, msg.text)) {
    return msg.text.replace(`@${BOT_USERNAME}`, '');
  } else if (botHasReplies(msg) || msg.chat.type === 'private') {
    return msg.text;
  }
};

/**
 * First, it verifies if user can query the bot,
 * and that it's not a command.
 * @param {object} bot
 * @param {object} msg
 */
const verifyResponse = (bot, msg) => {
  const notACommand = !/^\//.test(msg.text);
  if (notACommand) {
    query(bot, getTextResponse(msg), msg);
  }
};

module.exports = {
  verifyResponse,
};
