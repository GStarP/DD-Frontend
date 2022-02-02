interface Message {
  sender: number;
  receiver: number;
  type: 'text' | 'ack';
  time: string;
  payload: string;
}
