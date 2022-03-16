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
    // heartCheck(ws);
  };

  ws.onclose = () => {
    console.log('offline');
    store.commit('online', false);
  };

  ws.onerror = (e) => {
    console.error(e);
    store.commit('online', false);
  };

  ws.onmessage = (e: MessageEvent<string>) => {
    const msg: Message = JSON.parse(e.data);
    console.log('receive msg', msg);
    if (msg.type === 'ack') {
      // do nothing
    } else if (msg.type === 'heart') {
      if (timeoutTimer) clearTimeout(timeoutTimer);
      heartTimer = setTimeout(() => {
        heartCheck(ws);
      }, HEART_INTERVAL);
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
    try {
      ws.send(JSON.stringify(message));
      console.log('send msg', message);
    } catch (e) {
      console.error(e);
    }
  } else {
    console.error('you are now offline');
  }
}

// 心跳机制
const HEART_INTERVAL = 8 * 1000;
const TIMEOUT = 3 * 1000;
let timeoutTimer = setTimeout(() => null);
let heartTimer = setTimeout(() => {});
function heartCheck(ws: WebSocket | null) {
  if (ws === null) return;
  sendHeartMessage();
  timeoutTimer = setTimeout(() => {
    ws.close();
    store.commit('online', false);
  }, TIMEOUT);
}

// 发送心跳消息
function sendHeartMessage() {
  sendMessage({
    type: 'heart',
    sender: 0,
    receiver: 0,
    payload: '',
    group: 0,
    timestamp: 0
  });
}
