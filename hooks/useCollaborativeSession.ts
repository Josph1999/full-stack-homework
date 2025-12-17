import { useEffect, useRef, useState, useCallback } from 'react';
import { useBroadcastChannel } from 'react-broadcast-sync';
import { v4 as uuid } from 'uuid';
import {
  ChatMessage,
  CounterState,
  User,
  Activity,
  ThemeMode,
  CursorPosition,
  IncomingMessage,
  StateSyncPayload,
  UserJoinPayload,
  UserLeavePayload,
  TypingPayload,
  CursorMovePayload,
  DeleteMessagePayload,
  CounterUpdatePayload,
  NewActivityPayload,
  ThemeChangePayload,
  CollaborativeSessionReturn
} from '../types/models';

const CHANNEL = 'collaboration-dashboard';

function useDebounce<T extends (...args: never[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

export function useCollaborativeSession(): CollaborativeSessionReturn {
  const userIdRef = useRef<string | null>(null);
  const usernameRef = useRef<string | null>(null);
  const avatarRef = useRef<string | null>(null);

  if (typeof window !== 'undefined' && !userIdRef.current) {
    userIdRef.current = uuid();
    usernameRef.current = `User-${userIdRef.current.slice(0, 4)}`;
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'];
    avatarRef.current = colors[Math.floor(Math.random() * colors.length)];
  }
  
  const userId = userIdRef.current || '';
  const username = usernameRef.current || '';
  const avatarColor = avatarRef.current || '#667eea';

  const [users, setUsers] = useState<Record<string, User>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [counter, setCounter] = useState<CounterState>({ value: 0 });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [cursors, setCursors] = useState<Record<string, CursorPosition>>({});
  const [isLoading, setIsLoading] = useState(true);

  const { postMessage, messages: incomingMessages } = useBroadcastChannel(CHANNEL);

  const lastHandledIndex = useRef(0);
  const hasInitialized = useRef(false);

  const addActivity = useCallback((action: Activity['action'], details: string) => {
    const activity: Activity = {
      id: uuid(),
      userId,
      username,
      action,
      details,
      timestamp: Date.now()
    };

    setActivities(prev => [activity, ...prev].slice(0, 20)); 
    postMessage('NEW_ACTIVITY', { ...activity, senderId: userId });
  }, [userId, username, postMessage]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const savedTheme = localStorage.getItem('dashboard-theme') as ThemeMode;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    postMessage('USER_JOIN', { 
      id: userId, 
      name: username,
      avatarColor,
      senderId: userId 
    });

    postMessage('STATE_SYNC', {
      users,
      messages,
      counter,
      activities,
      theme,
      senderId: userId
    });

    addActivity('joined', 'Joined the session');

    setTimeout(() => setIsLoading(false), 500);

    return () => {
      postMessage('USER_LEAVE', { id: userId });
      postMessage('NEW_ACTIVITY', {
        id: uuid(),
        userId,
        username,
        action: 'left',
        details: 'Left the session',
        timestamp: Date.now(),
        senderId: userId
      });
    };
  }, []);

  useEffect(() => {
    for (let i = lastHandledIndex.current; i < incomingMessages.length; i++) {
      const { type, message } = incomingMessages[i] as IncomingMessage;

      if ('senderId' in message && message.senderId === userId) continue;

      switch (type) {
        case 'STATE_SYNC': {
          const payload = message as StateSyncPayload;
          setUsers((prev) =>
            JSON.stringify(prev) === JSON.stringify(payload.users)
              ? prev
              : payload.users
          );
          setMessages((prev) =>
            JSON.stringify(prev) === JSON.stringify(payload.messages)
              ? prev
              : payload.messages
          );
          setCounter((prev) =>
            prev.value === payload.counter.value ? prev : payload.counter
          );
          setActivities((prev) =>
            JSON.stringify(prev) === JSON.stringify(payload.activities)
              ? prev
              : payload.activities
          );
          setTheme(payload.theme);
          break;
        }

        case 'USER_JOIN': {
          const payload = message as UserJoinPayload;
          setUsers((prev) => ({
            ...prev,
            [payload.id]: {
              id: payload.id,
              name: payload.name,
              avatarColor: payload.avatarColor,
              lastActive: Date.now(),
              typing: false
            }
          }));
          break;
        }

        case 'USER_LEAVE': {
          const payload = message as UserLeavePayload;
          setUsers((prev) => {
            const copy = { ...prev };
            delete copy[payload.id];
            return copy;
          });
          setCursors((prev) => {
            const copy = { ...prev };
            delete copy[payload.id];
            return copy;
          });
          break;
        }

        case 'TYPING': {
          const payload = message as TypingPayload;
          setUsers((prev) => ({
            ...prev,
            [payload.id]: {
              ...prev[payload.id],
              typing: payload.typing,
              lastActive: Date.now()
            }
          }));
          break;
        }

        case 'CURSOR_MOVE': {
          const payload = message as CursorMovePayload;
          setCursors((prev) => ({
            ...prev,
            [payload.userId]: {
              userId: payload.userId,
              username: payload.username,
              x: payload.x,
              y: payload.y,
              avatarColor: payload.avatarColor
            }
          }));
          break;
        }

        case 'NEW_MESSAGE': {
          const payload = message as ChatMessage;
          setMessages((prev) => [...prev, payload]);
          break;
        }

        case 'DELETE_MESSAGE': {
          const payload = message as DeleteMessagePayload;
          setMessages((prev) => prev.filter((m) => m.id !== payload.id));
          break;
        }

        case 'COUNTER_UPDATE': {
          const payload = message as CounterUpdatePayload;
          setCounter({
            value: payload.value,
            lastUpdatedBy: payload.lastUpdatedBy,
            lastUpdatedAt: payload.lastUpdatedAt
          });
          break;
        }

        case 'NEW_ACTIVITY': {
          const payload = message as NewActivityPayload;
          setActivities((prev) => [payload, ...prev].slice(0, 20));
          break;
        }

        case 'THEME_CHANGE': {
          const payload = message as ThemeChangePayload;
          setTheme(payload.theme);
          localStorage.setItem('dashboard-theme', payload.theme);
          window.dispatchEvent(new CustomEvent('theme-change', { detail: payload.theme }));
          break;
        }
      }
    }

    lastHandledIndex.current = incomingMessages.length;
  }, [incomingMessages, userId]);

  const debouncedCursorMove = useDebounce((x: number, y: number) => {
    postMessage('CURSOR_MOVE', {
      userId,
      username,
      x,
      y,
      avatarColor,
      senderId: userId
    });
  }, 50);

  const markTyping = useCallback((typing: boolean) => {
    postMessage('TYPING', { id: userId, typing, senderId: userId });
  }, [userId, postMessage]);

  const sendMessage = useCallback((text: string, ttlMs?: number) => {
    const msg: ChatMessage = {
      id: uuid(),
      userId,
      text,
      createdAt: Date.now(),
      expiresAt: ttlMs ? Date.now() + ttlMs : undefined
    };

    setMessages((prev) => [...prev, msg]);
    postMessage('NEW_MESSAGE', { ...msg, senderId: userId });
    addActivity('sent message', text.substring(0, 30) + (text.length > 30 ? '...' : ''));

    if (ttlMs) {
      setTimeout(() => {
        deleteMessage(msg.id);
      }, ttlMs);
    }
  }, [userId, postMessage, addActivity]);

  const deleteMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    postMessage('DELETE_MESSAGE', { id, senderId: userId });
    addActivity('deleted message', 'Removed a message');
  }, [userId, postMessage, addActivity]);

  const updateCounter = useCallback((delta: number) => {
    const newCounterState = {
      value: counter.value + delta,
      lastUpdatedBy: userId,
      lastUpdatedAt: Date.now()
    };

    setCounter(newCounterState);
    postMessage('COUNTER_UPDATE', { ...newCounterState, senderId: userId });
    addActivity('updated counter', `${delta > 0 ? '+' : ''}${delta}`);
  }, [counter.value, userId, postMessage, addActivity]);

  const toggleTheme = useCallback(() => {
    const newTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('dashboard-theme', newTheme);
    window.dispatchEvent(new CustomEvent('theme-change', { detail: newTheme }));
    postMessage('THEME_CHANGE', { theme: newTheme, senderId: userId });
    addActivity('changed theme', `Switched to ${newTheme} mode`);
  }, [theme, userId, postMessage, addActivity]);

  const updateCursorPosition = useCallback((x: number, y: number) => {
    debouncedCursorMove(x, y);
  }, [debouncedCursorMove]);

  return {
    currentUserId: userId,
    currentUsername: username,
    avatarColor,
    users: Object.values(users),
    messages,
    counter,
    activities,
    theme,
    cursors: Object.values(cursors),
    isLoading,
    sendMessage,
    deleteMessage,
    updateCounter,
    markTyping,
    toggleTheme,
    updateCursorPosition
  };
}