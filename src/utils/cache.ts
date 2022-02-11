import { reqGetUserInfo } from '@/api/friend';
import store from '@/plugins/vuex';

const DEFAULT_USN = 'Unknown';

const userNameCacheJson = sessionStorage.getItem('dd-usn-cache');

const userNameCache: { [k: number]: string } = userNameCacheJson
  ? JSON.parse(userNameCacheJson)
  : {};

if (store.state.userInfo) {
  usnCache(store.state.userInfo.userId, store.state.userInfo.userName);
}

export function usn(userId: number): string {
  if (userNameCache[userId]) {
    return userNameCache[userId];
  } else {
    reqGetUserInfo(userId, 9999).then((res) => {
      if (res.code === 0) {
        userNameCache[userId] = res.data.userName;
        // 在获取到昵称后, 由于结果已经返回, 必须强行触发一次重新渲染, 才能正确显示
        store.commit('updateDialog');
      }
    });
    return DEFAULT_USN;
  }
}

export function usnCache(userId: number, userName: string) {
  userNameCache[userId] = userName;
}

export function usnc() {
  return userNameCache;
}
