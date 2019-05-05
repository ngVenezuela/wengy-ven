const NodeTelegramBotApi = require('node-telegram-bot-api');

/**
 * Class representing a TelegramBot.
 * @extends NodeTelegramBotApi
 */
class TelegramBot extends NodeTelegramBotApi {
  /**
   * Creates an instance of NodeTelegramBotApi
   * @param {string} token - Token given by @BotFather
   * @param {object} options - Options to initialize NodeTelegramBotApi
   * @see https://github.com/yagop/node-telegram-bot-api/blob/release/doc/api.md#new-telegrambottoken-options
   */
  constructor(token, options = {}) {
    super(token, options);
  }

  /**
   * Check for a valid telegram message
   * @param {object} msg - Message to check
   * @return {boolean}
   * @see https://core.telegram.org/bots/api#update
   */
  checkMessage(msg) {
    return (
      msg.update_id ||
      msg.message ||
      msg.edited_message ||
      msg.channel_post ||
      msg.edited_channel_post ||
      msg.inline_query ||
      msg.chosen_inline_result ||
      msg.callback_query ||
      msg.shipping_query ||
      msg.pre_checkout_query ||
      msg.poll
    );
  }

  /**
   * Give message to processUpdate parent method
   * @param {object} msg - Message to process
   */
  processMessage(msg) {
    this.processUpdate(msg);
  }
}

module.exports = TelegramBot;
