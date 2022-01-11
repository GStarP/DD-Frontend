import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/plugins/router";
import store from "@/plugins/vuex";
import useElementPlus from "@/plugins/element";

const app = createApp(App);

app.use(router);
app.use(store);
useElementPlus(app);

app.mount("#app");
