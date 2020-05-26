import messages from '../messages';
import { sendMessage } from './bot-methods';
import { getChatType } from './admin';

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
 * @param {object} message
 */
export const sayHello = async(message) => {
  const type = await getChatType(message);

  if (type === 'main') {
    message.new_chat_members.forEach(async({ first_name: firstName, username }) => {
      const text = messages.welcome.replace(
        '#{name}',
        formatName(firstName, username)
      );

      await sendMessage({
        chatId: message.chat.id,
        text,
        replyToMessageId: message.message_id,
      });
    });
  }
};

/**
 * Say goodbye to ex-members of the group
 * @param {object} message
 */
export const sayGoodbye = async(message) => {
  const {
    left_chat_member: { first_name: firstName },
    chat: { id: chatId },
  } = message;
  const type = await getChatType(message);

  if (type === 'main') {
    await sendMessage({
      chatId,
      text: messages.goodBye.replace('#{name}', firstName),
    });
  }
};
