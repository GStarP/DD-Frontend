import { createStore } from 'vuex';

let userInfo: UserInfo = {
  userId: 0,
  userName: '',
  password: '',
  email: '',
  phone: '',
  gender: 0,
  age: 0,
  isFriend: false,
  isBlacked: false
};
// 刷新时加载保留的用户信息
const userInfoJson = sessionStorage.getItem('dd-store-user-info');
if (userInfoJson !== null) {
  userInfo = JSON.parse(userInfoJson);
}

const store = createStore({
  state: {
    userInfo
  },
  mutations: {
    userInfo(state, userInfo: UserInfo) {
      state.userInfo = userInfo;
    }
  }
});

export default store;
