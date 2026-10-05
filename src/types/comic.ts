export type ArtStyle = 
  | 'classic-comic' 
  | 'anime-manga' 
  | 'retro-popart' 
  | 'dark-noir' 
  | 'cyberpunk' 
  | 'chibi-cartoon' 
  | 'watercolor-fantasy';

export type Tone = 
  | 'funny' 
  | 'dramatic' 
  | 'action' 
  | 'mysterious' 
  | 'whimsical' 
  | 'noir' 
  | 'scifi';

export type BubbleType = 'speech' | 'shout' | 'thought' | 'whisper';

export type ComicLayoutType = 'grid-2x2' | 'strip-horizontal' | 'webtoon-vertical' | 'magazine-page';

export interface DialogueItem {
  id: string;
  speaker: string;
  text: string;
  type: BubbleType;
}

export interface ComicPanel {
  panelNumber: number;
  title: string;
  setting: string;
  action: string;
  charactersPresent: string[];
  narration: string;
  dialogues: DialogueItem[];
  soundEffect?: string;
  visualDescription: string;
  moodColor: string;
  cameraAngle: string;
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

export interface ComicStory {
  id: string;
  title: string;
  subtitle: string;
  prompt: string;
  characterName: string;
  characterDescription?: string;
  setting: string;
  tone: Tone;
  artStyle: ArtStyle;
  panels: ComicPanel[];
  createdAt: string;
  layout: ComicLayoutType;
}

export interface GenerationRequest {
  prompt: string;
  characterName: string;
  setting: string;
  tone: Tone;
  artStyle: ArtStyle;
  panelCount?: number;
  layout?: ComicLayoutType;
}

export interface ExportRecord {
  id: string;
  comicId: string;
  comicTitle: string;
  filename: string;
  exportDate: string;
  pageCount: number;
  panelCount: number;
  fileSizeBytes: number;
  downloadUrl?: string;
}
