export type BotStatus =
  | 'unregistered'
  | 'generating_code'
  | 'awaiting_pair'
  | 'verifying'
  | 'connected'
  | 'disconnected';

export type FeatureCategory =
  | 'group'
  | 'sticker'
  | 'ai'
  | 'downloader'
  | 'tools'
  | 'games'
  | 'owner'
  | 'exclusive';

export interface BotFeature {
  id: string;
  name: string;
  command: string;
  shortCmd?: string; // Shortcut 1-3 huruf super cepat diketik (misal: .s, .al, .ht)
  aliases: string[];
  category: FeatureCategory;
  description: string;
  example: string;
  permission: 'all' | 'admin' | 'owner';
  enabled: boolean;
  popular?: boolean;
}

export interface BotSession {
  phoneNumber: string;
  botName: string;
  prefix: string;
  status: BotStatus;
  pairingCode: string;
  codeExpiresAt: number;
  linkedAt: number | null;
  expiredAt: number | null;
  planName: string;
  batteryLevel: number;
  isCharging: boolean;
  pingMs: number;
  uptimeSeconds: number;
  messagesProcessed: number;
  commandsExecuted: number;
  groupsCount: number;
  isPublic: boolean;
  autoRead: boolean;
  antiCall: boolean;
  stickerWatermark: {
    packname: string;
    author: string;
  };
  ownerNumber: string;
  ownerName: string;
  isFreeAccess: boolean;
  premiumUsers?: string[];
}

export interface GroupConfig {
  id: string;
  name: string;
  membersCount: number;
  botIsAdmin: boolean;
  antilink: boolean;
  antispam: boolean;
  antitoxic: boolean;
  welcome: boolean;
  goodbye: boolean;
  isMuted: boolean;
}

export interface RentalPlan {
  id: string;
  name: string;
  period: string;
  durationDays: number;
  price: number;
  formattedPrice: string;
  badge?: string;
  popular?: boolean;
  features: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  senderName?: string;
  text: string;
  timestamp: string;
  mediaType?: 'text' | 'sticker' | 'image' | 'audio';
  mediaUrl?: string;
}
