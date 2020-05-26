import { sayHello, sayGoodbye } from './greetings';
import { verifyUrls } from './admin';
import { verifyCode } from './github';
import { verifyResponse } from './dialogflow';

const handleListenEvents = async(message) => {
  if (message.new_chat_members) {
    /* TODO: change greeting to be after thejoincaptcha bot accepts an user */
    await sayHello(message);
  } else if (message.left_chat_member) {
    await sayGoodbye(message);
  } else {
    await verifyUrls(message);
    await verifyCode(message);
    await verifyResponse(message);
  }
};

export default handleListenEvents;
