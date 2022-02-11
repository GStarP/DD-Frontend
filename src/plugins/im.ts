/**
 * 即时通讯模块
 */

import store from '@/plugins/vuex';
import { formatTimestamp } from '@/utils/time';

let ws: WebSocket | null = null;

export function initIM(userId: number) {
  ws = new WebSocket(`ws://172.19.240.21/dd/session/${userId}`);
  ws.onopen = () => {
    console.log('online');
    store.commit('online', true);
  };
  ws.onclose = () => {
    console.log('offline');
    store.commit('online', false);
  };
  ws.onmessage = (e: MessageEvent<string>) => {
    const msg: Message = JSON.parse(e.data);
    console.log('receive msg', msg);
    if (msg.type === 'ack') {
      // do nothing
    } else {
      receiveMessage(msg);
    }
  };
}

export function reconnect(userId: number) {
  initIM(userId);
}

function receiveMessage(message: Message) {
  // 重排会话列表
  let k: string;
  if (message.group === 0) {
    k = 'f' + message.sender;
    rearrangeFriendList(message);
  } else {
    k = 'g' + message.receiver;
    rearrangeGroupList(message);
  }
  // 接收到对应的消息记录中
  store.commit('recvMessage', {
    k,
    message
  });
}

function rearrangeFriendList(message: Message) {
  const friendId = message.sender;
  const friendList: FriendBriefWithMsg[] = store.state.friendList.slice();
  // 寻找新消息的发送者的下标
  let index = -1;
  for (let i = 0; i < friendList.length; i++) {
    if (friendList[i].friendId === friendId) {
      index = i;
      break;
    }
  }
  // 把这个发送者移到列表最前端
  if (index > -1) {
    const e = friendList.splice(index, 1)[0];
    if (message.type === 'text') {
      e.msg = message.payload;
    } else if (message.type === 'image') {
      e.msg = '[image]';
    }
    e.msgTime = formatTimestamp(message.timestamp);
    e.msgNum++;
    friendList.unshift(e);
    store.commit('friendList', friendList);
  }
}

function rearrangeGroupList(message: Message) {
  const groupId = message.receiver;
  const groupList: GroupBriefWithMsg[] = store.state.groupList.slice();
  // 寻找新消息的群组的下标
  let index = -1;
  for (let i = 0; i < groupList.length; i++) {
    if (groupList[i].groupId === groupId) {
      index = i;
      break;
    }
  }
  // 把这个群组移到列表最前端
  if (index > -1) {
    const e = groupList.splice(index, 1)[0];
    if (message.type === 'text') {
      e.msg = message.payload;
    } else if (message.type === 'image') {
      e.msg = '[image]';
    }
    e.msgTime = formatTimestamp(message.timestamp);
    e.msgNum++;
    groupList.unshift(e);
    store.commit('groupList', groupList);
  }
}

export function sendMessage(message: Message) {
  if (ws) {
    ws.send(JSON.stringify(message));
    console.log('send msg', message);
  } else {
    console.error('you are now offline');
  }
}
