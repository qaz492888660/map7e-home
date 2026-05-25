import { createApp } from "vue";
import "@/style/style.scss";
import App from "@/App.vue";
// 引入 pinia
import { createPinia } from "pinia";
// Vercel Web Analytics
import { inject } from '@vercel/analytics';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount("#app");

// 注入 Vercel Analytics
inject();

// PWA
navigator.serviceWorker.addEventListener("controllerchange", () => {
  // 弹出更新提醒
  console.log("站点已更新，刷新后生效");
  ElMessage("站点已更新，刷新后生效");
});
