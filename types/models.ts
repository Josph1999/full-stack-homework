export interface User {
  id: string;
  name: string;
  avatarColor: string;
  lastActive: number;
  typing: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  createdAt: number;
  expiresAt?: number;
}

export interface CounterState {
  value: number;
  lastUpdatedBy?: string;
  lastUpdatedAt?: number;
}

export interface Activity {
  id: string;
  userId: string;
  username: string;
  action: 'sent message' | 'deleted message' | 'updated counter' | 'joined' | 'left' | 'changed theme';
  details: string;
  timestamp: number;
}

export type ThemeMode = 'light' | 'dark';

export interface CursorPosition {
  userId: string;
  username: string;
  x: number;
  y: number;
  avatarColor: string;
}

export type BroadcastMessageType =
  | 'STATE_SYNC'
  | 'USER_JOIN'
  | 'USER_LEAVE'
  | 'TYPING'
  | 'CURSOR_MOVE'
  | 'NEW_MESSAGE'
  | 'DELETE_MESSAGE'
  | 'COUNTER_UPDATE'
  | 'NEW_ACTIVITY'
  | 'THEME_CHANGE';

export interface StateSyncPayload {
  users: Record<string, User>;
  messages: ChatMessage[];
  counter: CounterState;
  activities: Activity[];
  theme: ThemeMode;
  senderId: string;
}

export interface UserJoinPayload {
  id: string;
  name: string;
  avatarColor: string;
  senderId: string;
}

export interface UserLeavePayload {
  id: string;
}

export interface TypingPayload {
  id: string;
  typing: boolean;
  senderId: string;
}

export interface CursorMovePayload {
  userId: string;
  username: string;
  x: number;
  y: number;
  avatarColor: string;
  senderId: string;
}

export interface NewMessagePayload extends ChatMessage {
  senderId: string;
}

export interface DeleteMessagePayload {
  id: string;
  senderId: string;
}

export interface CounterUpdatePayload extends CounterState {
  senderId: string;
}

export interface NewActivityPayload extends Activity {
  senderId: string;
}

export interface ThemeChangePayload {
  theme: ThemeMode;
  senderId: string;
}

export type BroadcastMessagePayload =
  | StateSyncPayload
  | UserJoinPayload
  | UserLeavePayload
  | TypingPayload
  | CursorMovePayload
  | NewMessagePayload
  | DeleteMessagePayload
  | CounterUpdatePayload
  | NewActivityPayload
  | ThemeChangePayload;

export interface IncomingMessage {
  type: BroadcastMessageType;
  message: BroadcastMessagePayload;
}

export interface CollaborativeSessionReturn {
  currentUserId: string;
  currentUsername: string;
  avatarColor: string;
  users: User[];
  messages: ChatMessage[];
  counter: CounterState;
  activities: Activity[];
  theme: ThemeMode;
  cursors: CursorPosition[];
  isLoading: boolean;
  sendMessage: (text: string, ttlMs?: number) => void;
  deleteMessage: (id: string) => void;
  updateCounter: (delta: number) => void;
  markTyping: (typing: boolean) => void;
  toggleTheme: () => void;
  updateCursorPosition: (x: number, y: number) => void;
}