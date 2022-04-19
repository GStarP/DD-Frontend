interface Message {
  sender: number;
  receiver: number;
  group: 0 | 1;
  type: 'ack' | 'text' | 'image' | 'heart';
  timestamp: number;
  payload: string;
}
