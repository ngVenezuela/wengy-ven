import { sendGist, sendCommunityRepo } from "./github";
import { sendGroupId } from "./admin";
import { sendMessage } from "./bot-methods";
import messages from "../messages";
import { Message } from "./interfaces";

const handleListenCommands = async (message: Message) => {
  if (message.text) {
    if (/^\/comunidades/.test(message.text)) {
      await sendMessage({
        chatId: message.chat.id,
        text: messages.githubOpenVeLink
      });
    } else if (/^\/gist ([\s\S.]+)/.test(message.text)) {
      const rawCode = message.text.match(/^\/gist ([\s\S.]+)/)![1];

      await sendGist(message, rawCode);
    } else if (/^\/github/.test(message.text)) {
      await sendCommunityRepo(message.chat.id);
    } else if (/^\/groupId/.test(message.text)) {
      await sendGroupId(message.chat);
    }
  }
};

export default handleListenCommands;
