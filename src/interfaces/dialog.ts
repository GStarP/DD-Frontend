interface Message {
  sender: number;
  receiver: number;
  group: 0 | 1;
  type: 'text' | 'ack' | 'image';
  timestamp: number;
  payload: string;
}
