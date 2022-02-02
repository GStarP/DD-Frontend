import { createStore } from 'vuex';

const store = createStore({
  state: {
    uid: 0
  },
  mutations: {
    uid(state, userId: number) {
      state.uid = userId;
    }
  }
});

export default store;
