const { welcome, goodBye } = require('config/messages');
const { sendMessage } = require('bot-api-overrides');

/**
 * Returns username or first name of the user
 * @param {string} firstName
 * @param {string} userName
 * @return {string}
 */
const formatName = (firstName, userName) =>
  userName ? '@'.concat(userName) : firstName;

/**
 * Say hello to new members of the group
 * @param {object} bot
 * @param {object} msg
 */
const sayHello = async (bot, msg) => {
  const chatId = msg.chat.id;
  const chatInfo = await bot.getChat(chatId);
  const {
    type,
    all_members_are_administrators: allMembersAreAdministrators,
  } = chatInfo;
  if (['supergroup', 'group'].includes(type) && !allMembersAreAdministrators) {
    msg.new_chat_members.forEach(({ first_name, username }) => {
      const message = welcome.replace(
        '#{name}',
        formatName(first_name, username)
      );

      sendMessage(bot, msg.chat.id, message, {
        reply_to_message_id: msg.message_id,
      });
    });
  }
};

/**
 * Say goodbye to ex-members of the group
 * @param {object} bot
 * @param {object} msg
 */
const sayGoodbye = async (bot, msg) => {
  const chatId = msg.chat.id;
  const chatInfo = await bot.getChat(chatId);
  const { first_name: firstName, username } = msg.left_chat_member;
  const {
    type,
    all_members_are_administrators: allMembersAreAdministrators,
  } = chatInfo;
  if (['supergroup', 'group'].includes(type) && !allMembersAreAdministrators) {
    sendMessage(
      bot,
      msg.chat.id,
      goodBye.replace('#{name}', formatName(firstName, username))
    );
  }
};

module.exports = {
  sayHello,
  sayGoodbye,
};
