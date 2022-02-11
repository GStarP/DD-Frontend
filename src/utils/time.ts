import moment from 'moment';

// 没有消息记录, 暂时只显示时分秒
export function formatTimestamp(timestamp: number): string {
  return moment(timestamp).format('HH:mm:ss');
}
