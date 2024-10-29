import { ChatUser } from './ChatMessages.props';

export interface ChatSettingsProps {
  modelValue: CharacterSettings;
  character: ChatUser;
}

export class CharacterSettings {
  generateImages: boolean;
  generateAudios: boolean;
  generateVideos: boolean;

  nsfw: boolean;

  categories: string[];
  appearance: string;
  scenario: string;
  personality: string;
  dialogues: string;
  description: string;
  firstMessage: string;

  /**
   *
   */
  constructor() {
    this.generateImages = false;
    this.generateAudios = false;
    this.generateVideos = false;

    this.nsfw = false;

    this.categories = [];
    this.appearance = '';
    this.scenario = '';
    this.personality = '';
    this.dialogues = '';
    this.description = '';
    this.firstMessage = '';
  }
}
