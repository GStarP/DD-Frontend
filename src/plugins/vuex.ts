import { createStore } from "vuex";

const store = createStore({
  state: {
    count: 6
  },
  mutations: {
    inc(state) {
      state.count++;
    }
  }
});

export default store;
