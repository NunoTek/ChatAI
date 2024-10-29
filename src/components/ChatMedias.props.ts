import { ChatUser } from './ChatMessages.props';

export interface ChatMedia {
  src: string;
  name: string;
}
export interface ChatMediasProps {
  character: ChatUser;
  medias: ChatMedia[];
}
