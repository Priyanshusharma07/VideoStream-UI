import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '@/lib/auth-session';

export type Participant = {
  userId: number;
  name: string;
  role: 'OWNER' | 'MODERATOR' | 'MEMBER';
};

export type MessagePayload = {
  id: string;
  roomId: string;
  senderId: number;
  clientMessageId: string;
  message: string;
  createdAt: string;
  sender: {
    id: number;
    name: string;
  };
};

export type TypingPayload = {
  userId: number;
  name: string;
  isTyping: boolean;
};

export function useRoomSocket(roomCode: string) {
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<number, string>>({});
  const [raisedHands, setRaisedHands] = useState<Set<number>>(new Set());
  const [roomDetails, setRoomDetails] = useState<any>(null);
  const [localUserId, setLocalUserId] = useState<number | undefined>(undefined);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const raiseHand = useCallback(() => {
    socketRef.current?.emit('hand:raise', { roomCode });
  }, [roomCode]);

  const lowerHand = useCallback(() => {
    socketRef.current?.emit('hand:lower', { roomCode });
  }, [roomCode]);

  const sendTypingStart = useCallback(() => {
    socketRef.current?.emit('typing:start', { roomCode });
  }, [roomCode]);

  const sendTypingStop = useCallback(() => {
    socketRef.current?.emit('typing:stop', { roomCode });
  }, [roomCode]);

  const sendMessage = useCallback((message: string) => {
    if (!message.trim()) return;
    const clientMessageId = crypto.randomUUID();
    socketRef.current?.emit('message:send', {
      roomCode,
      clientMessageId,
      message,
    });
  }, [roomCode]);

  useEffect(() => {
    let active = true;
    let socket: Socket | null = null;

    async function initSocket() {
      const token = await getAccessToken();
      if (!active) return;

      const url = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001'}/rooms`;
      socket = io(url, {
        transports: ['websocket'],
        auth: { token },
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        setConnected(true);
        socket?.emit('room:join', { roomCode });
      });

      socket.on('disconnect', () => {
        setConnected(false);
      });

      socket.on('room:joined', (data: { room: any; localUserId: number; participants: Participant[] }) => {
        setRoomDetails(data.room);
        setLocalUserId(data.localUserId);
        setParticipants(data.participants);
      });

      socket.on('participant:joined', (p: Participant) => {
        setParticipants((prev) => {
          if (prev.some((x) => x.userId === p.userId)) return prev;
          return [...prev, p];
        });
      });

      socket.on('participant:left', (data: { userId: number }) => {
        setParticipants((prev) => prev.filter((p) => p.userId !== data.userId));
        setRaisedHands((prev) => {
          const next = new Set(prev);
          next.delete(data.userId);
          return next;
        });
        setTypingUsers((prev) => {
          const next = { ...prev };
          delete next[data.userId];
          return next;
        });
      });

      socket.on('message:new', (msg: MessagePayload) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id || m.clientMessageId === msg.clientMessageId)) return prev;
          return [...prev, msg];
        });
      });

      socket.on('typing:update', (data: TypingPayload) => {
        setTypingUsers((prev) => {
          const next = { ...prev };
          if (data.isTyping) {
            next[data.userId] = data.name;
          } else {
            delete next[data.userId];
          }
          return next;
        });
      });

      socket.on('hand:raised', (data: { userId: number }) => {
        setRaisedHands((prev) => {
          const next = new Set(prev);
          next.add(data.userId);
          return next;
        });
      });

      socket.on('hand:lowered', (data: { userId: number }) => {
        setRaisedHands((prev) => {
          const next = new Set(prev);
          next.delete(data.userId);
          return next;
        });
      });
    }

    initSocket();

    return () => {
      active = false;
      socket?.emit('room:leave', { roomCode });
      socket?.disconnect();
    };
  }, [roomCode]);

  return {
    connected,
    messages,
    setMessages,
    participants,
    typingUsers,
    raisedHands,
    roomDetails,
    localUserId,
    sendMessage,
    sendTypingStart,
    sendTypingStop,
    raiseHand,
    lowerHand,
  };
}
