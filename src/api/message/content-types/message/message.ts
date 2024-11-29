export interface Message {
  id: number;
  text: string;
  timestamp: string;
  sender?: {
    id: number;
    username: string;
  };
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}
