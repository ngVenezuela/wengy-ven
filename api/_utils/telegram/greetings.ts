import messages from '../messages';
import { sendMessage } from './bot-methods';
import { getChatType } from './admin';
import { Message } from './interfaces';

const formatName = (firstName: string, userName: string) =>
  userName ? '@'.concat(userName) : firstName;

export const sayHello = async (message: Message): Promise<void> => {
  const type = await getChatType(message);

  if (message.new_chat_members && type === 'main') {
    message.new_chat_members.forEach(
      async ({ first_name: firstName, username = '' }) => {
        const text = messages.welcome.replace(
          '#{name}',
          formatName(firstName, username),
        );

        await sendMessage({
          chatId: message.chat.id,
          text,
          replyToMessageId: message.message_id,
        });
      },
    );
  }
};

export const sayGoodbye = async (message: Message): Promise<void> => {
  if (message.left_chat_member) {
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
  }
};
