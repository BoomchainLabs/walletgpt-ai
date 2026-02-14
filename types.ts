export interface User {
  address: string;
  isConnected: boolean;
}

export interface RewardResponse {
  message?: string;
  error?: string;
  txHash?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: number;
}

export interface NFT {
  contractAddress: string;
  tokenId: string;
  amount: string;
  contractType: string;
  name: string;
  description?: string;
  image?: string;
}