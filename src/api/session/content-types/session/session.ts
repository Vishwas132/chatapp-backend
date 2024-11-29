export interface Session {
  id: number;
  socketId: string;
  user?: {
    id: number;
    username: string;
  };
  lastSeen: string;
  status: 'online' | 'away' | 'offline';
  createdAt?: string;
  updatedAt?: string;
}
