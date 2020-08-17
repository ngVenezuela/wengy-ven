// reference: https://core.telegram.org/bots/api#available-types

interface User {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface Chat {
  id: number;
  type: string;
}

export interface Entity {
  type: string;
  offset: number;
  length: number;
  language?: string;
  url?: string;
}

export interface Message {
  message_id: number;
  chat: Chat;
  entities?: Entity[];
  text?: string;
  from?: User;
  reply_to_message?: Omit<Message, 'reply_to_message'>;
  new_chat_members?: User[];
  left_chat_member?: User;
}
