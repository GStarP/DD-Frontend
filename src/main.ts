import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/plugins/router';
import store from '@/plugins/vuex';
import { usnc } from '@/utils/cache';

const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');

// 刷新时保留信息
window.onbeforeunload = () => {
  // 保留用户信息
  sessionStorage.setItem(
    'dd-state-user-info',
    JSON.stringify(store.state.userInfo)
  );
  // 保留昵称缓存
  sessionStorage.setItem('dd-usn-cache', JSON.stringify(usnc()));
};
