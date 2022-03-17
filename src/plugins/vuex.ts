import { usnCache } from '@/utils/cache';
import { useRoute } from 'vue-router';
import { createStore } from 'vuex';

// 刷新时加载保留的状态
const userInfoJson = sessionStorage.getItem('dd-state-user-info');

const store = createStore({
  state: {
    userInfo: userInfoJson
      ? (function () {
          const o = JSON.parse(userInfoJson) as UserInfo;
          return o;
        })()
      : {
          userId: 0,
          userName: '',
          password: '',
          email: '',
          phone: '',
          gender: 0,
          age: 0,
          friend: false,
          blacked: false
        },
    // ws 是否在线
    online: false,
    // 当前用户全部的消息记录
    dialogs: {} as { [k: string]: Message[] },
    // 好友列表必须外包给 vuex 否则 ws 无法修改
    friendList: [] as FriendBriefWithMsg[],
    groupList: [] as GroupBriefWithMsg[],
    // 当前对话
    currentDialog: ''
  },
  getters: {
    messages(state, k: string) {
      if (state.dialogs[k]) {
        return state.dialogs[k];
      } else {
        return [];
      }
    }
  },
  mutations: {
    userInfo(state, userInfo: UserInfo) {
      state.userInfo = userInfo;
    },
    online(state, o: boolean) {
      state.online = o;
    },
    // 用于强行触发与 dialog 有关的更新
    updateDialog(state) {
      const d = Object.create(state.dialogs);
      state.dialogs = {};
      state.dialogs = d;
    },
    recvMessage(state, payload: { k: string; message: Message }) {
      if (state.dialogs[payload.k]) {
        state.dialogs[payload.k].push(payload.message);
      } else {
        state.dialogs[payload.k] = [payload.message];
      }
    },
    friendList(state, fl: FriendBriefWithMsg[]) {
      state.friendList = fl;
    },
    clearUnread(
      state,
      payload: {
        type: string;
        index: number;
      }
    ) {
      if (payload.type === 'f') {
        state.friendList[payload.index].msgNum = 0;
      } else if (payload.type === 'g') {
        state.groupList[payload.index].msgNum = 0;
      }
    },
    groupList(state, gl: GroupBriefWithMsg[]) {
      state.groupList = gl;
    },
    curDialog(state, k: string) {
      state.currentDialog = k;
    }
  }
});

export default store;
