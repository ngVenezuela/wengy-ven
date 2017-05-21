const NodeTelegramBotApi = require('node-telegram-bot-api');

class TelegramBot extends NodeTelegramBotApi {

  constructor(token, options = {}) {
    super(token, options);
  }

  /**
   * @return {boolean}
   * @see https://core.telegram.org/bots/api#update
   */
  checkMessage(msg) {
    return msg.message
      || msg.edited_message
      || msg.channel_post
      || msg.edited_channel_post
      || msg.inline_query
      || msg.chosen_inline_result
      || msg.callback_query;
  }

  proccessMessage(msg) {
    this.processUpdate(msg);
  }

}

module.exports = TelegramBot;
