import { CharacterSettings } from './ChatSettings.props';

export interface ChatMessagesProps {
  modelValue: ChatMessage[];

  currentUser: ChatUser;
  character: ChatUser;
  settings: CharacterSettings;

  receiverLoading?: boolean;

  options?: ChatOptions;
}

export interface ChatOptions {
  connected: boolean;
  noConnectionLabel: string;
  noMessagesLabel: string;
}

export class ChatUser {
  key: string;
  name: string | undefined;
  avatar: string | undefined;

  constructor(
    key = '',
    name: string | undefined = undefined,
    avatar: string | undefined = undefined
  ) {
    this.key = key;
    this.name = name;
    this.avatar = avatar;
  }
}

export enum ChatMessageRoles {
  System = 'system',
  Assistant = 'assistant',
  User = 'user',
}

export enum ChatMessageTypes {
  Text = 'text',
  Image = 'image',
  Speech = 'speech',
}

export class ChatMessage {
  content: string;
  role: string | 'system' | 'assistant' | 'user';
  stamp: Date | undefined;
  type: ChatMessageTypes;
  userKey: string | undefined;

  constructor(
    content: string,
    role = ChatMessageRoles.User,
    stamp = new Date(),
    userKey: string | undefined = undefined,
    type = ChatMessageTypes.Text
  ) {
    this.content = content;
    this.role = role;
    this.stamp = stamp;
    this.userKey = userKey;
    this.type = type;
  }
}
