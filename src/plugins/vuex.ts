import { createStore } from 'vuex';

const store = createStore({
  state: {
    userInfo: {
      userId: 0,
      userName: '',
      password: '',
      email: '',
      phone: '',
      gender: 0,
      age: 0,
      isFriend: false,
      isBlacked: false
    } as UserInfo
  },
  mutations: {
    userInfo(state, userInfo: UserInfo) {
      state.userInfo = userInfo;
    }
  }
});

export default store;
