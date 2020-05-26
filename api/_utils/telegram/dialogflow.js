import dialogflow from '@google-cloud/dialogflow';

import { sendMessage } from './bot-methods';

const {
  BOT_USERNAME,
  DIALOGFLOW_CLIENT_EMAIL,
  DIALOGFLOW_PRIVATE_KEY,
  DIALOGFLOW_PROJECT_ID,
} = process.env;

/**
 * Verify that dialogflow has a valid
 * response to the query
 * @param {object} response
 */
const isResponseFullfilled = response =>
  response.queryResult && response.queryResult.fulfillmentText !== '';

/**
 * Verify that the message is a reply to the bot itself
 * @param {object} message
 */
const isBotReply = message =>
  Object.prototype.hasOwnProperty.call(message, 'reply_to_message') &&
  message.reply_to_message.from.username === BOT_USERNAME;

/**
 * Verify that the bot was mentioned in a text
 * @param {array} entities
 * @param {string} text
 */
const wasBotMentioned = (entities, text) =>
  entities &&
  entities.find(entity => entity.type === 'mention') &&
  text.includes(`@${BOT_USERNAME}`);

/**
 * Method that returns a text depending if it's a reply/mention/private message
 * @param {object} message
 */
const getTextResponse = message => {
  if (wasBotMentioned(message.entities, message.text)) {
    return message.text.replace(`@${BOT_USERNAME}`, '');
  } else if (isBotReply(message) || message.chat.type === 'private') {
    return message.text;
  }
};

/**
 * Makes a http request to dialogflow with a query
 * @param {object} message
 */
const query = async(message) => {
  const text = getTextResponse(message);

  if (
    DIALOGFLOW_CLIENT_EMAIL &&
    DIALOGFLOW_PRIVATE_KEY &&
    DIALOGFLOW_PROJECT_ID
    ) {
    const privateKeyWithActualNewLines = DIALOGFLOW_PRIVATE_KEY.replace(/\\n/g, '\n')

    const config = {
      credentials: {
        private_key: privateKeyWithActualNewLines,
        client_email: DIALOGFLOW_CLIENT_EMAIL,
      },
    };
    const sessionClient = new dialogflow.SessionsClient(config);
    const sessionPath = sessionClient.projectAgentSessionPath(
      DIALOGFLOW_PROJECT_ID,
      message.from.id
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
          languageCode: 'es',
        },
      },
    };
    const [response] = await sessionClient.detectIntent(request);

    if (isResponseFullfilled(response)) {
      await sendMessage({
        chatId: message.chat.id,
        text: response.queryResult.fulfillmentText,
        replyToMessageId: message.message_id,
      });
    }
  }
};

/**
 * Verify that is not a command and that
 * the bot has something to respond
 * @param {object} message
 */
export const verifyResponse = async(message) => {
  const isNotACommand = !/^\//.test(message.text);

  if (isNotACommand) {
    await query(message);
  }
};
