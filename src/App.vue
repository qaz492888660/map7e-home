<template>
  <!-- 加载 -->
  <Loading />
  <!-- 壁纸 -->
  <Background @loadComplete="loadComplete" />
  <!-- 主界面 -->
  <Transition name="fade" mode="out-in">
    <main id="main" :class="{ 'previewing-bg': store.backgroundShow }" v-if="store.imgLoadStatus">
      <div class="preview-curtain preview-curtain-left" :class="{ active: store.backgroundShow }" />
      <div class="preview-curtain preview-curtain-right" :class="{ active: store.backgroundShow }" />
      <div class="container" :class="{ hidden: store.backgroundShow }">
        <section class="all" v-show="!store.setOpenState">
          <MainLeft />
          <MainRight v-show="!store.boxOpenState" />
          <Box v-show="store.boxOpenState" />
        </section>
        <section class="more" v-show="store.setOpenState" @click="store.setOpenState = false">
          <MoreSet />
        </section>
      </div>
      <!-- 移动端菜单按钮 -->
      <Icon
        class="menu"
        size="24"
        :class="{ hidden: store.backgroundShow }"
        @click="store.mobileOpenState = !store.mobileOpenState"
      >
        <component :is="store.mobileOpenState ? CloseSmall : HamburgerButton" />
      </Icon>
      <!-- 页脚 -->
      <Transition name="fade" mode="out-in">
        <Footer :class="{ hidden: store.backgroundShow || store.setOpenState }" />
      </Transition>
      <button
        class="bg-glow-trigger"
        :class="{ hidden: store.backgroundShow }"
        type="button"
        aria-label="暂时只看背景"
        @click="previewBackground"
      />
    </main>
  </Transition>
</template>
<script setup>
import { helloInit, checkDays } from "@/utils/getTime.js";
import { HamburgerButton, CloseSmall } from "@icon-park/vue-next";
import { mainStore } from "@/store";
import { Icon } from "@vicons/utils";
import Loading from "@/components/Loading.vue";
import MainLeft from "@/views/Main/Left.vue";
import MainRight from "@/views/Main/Right.vue";
import Background from "@/components/Background.vue";
import Footer from "@/components/Footer.vue";
import Box from "@/views/Box/index.vue";
import MoreSet from "@/views/MoreSet/index.vue";
import cursorInit from "@/utils/cursor.js";
import config from "@/../package.json";

const store = mainStore();
let backgroundPreviewTimer = null;

// 页面宽度
const getWidth = () => {
  store.setInnerWidth(window.innerWidth);
};

// 加载完成事件
const loadComplete = () => {
  nextTick(() => {
    // 欢迎提示
    helloInit();
    // 默哀模式
    checkDays();
  });
};

// 监听宽度变化
watch(
  () => store.innerWidth,
  (value) => {
    if (value < 990) {
      store.boxOpenState = false;
    }
  },
);

const previewBackground = () => {
  if (backgroundPreviewTimer) {
    clearTimeout(backgroundPreviewTimer);
    backgroundPreviewTimer = null;
  }
  store.backgroundShow = true;
  backgroundPreviewTimer = setTimeout(() => {
    store.backgroundShow = false;
    backgroundPreviewTimer = null;
  }, 3200);
};

onMounted(() => {
  // 自定义鼠标
  cursorInit();

  // 屏蔽右键
  document.oncontextmenu = () => {
    ElMessage({
      message: "为了浏览体验，本站禁用右键",
      grouping: true,
      duration: 2000,
    });
    return false;
  };

  // 鼠标中键事件
  window.addEventListener("mousedown", (event) => {
    if (event.button == 1) {
      store.backgroundShow = !store.backgroundShow;
      ElMessage({
        message: `已${store.backgroundShow ? "开启" : "退出"}壁纸展示状态`,
        grouping: true,
      });
    }
  });

  // 监听当前页面宽度
  getWidth();
  window.addEventListener("resize", getWidth);

  // 控制台输出
  const styleTitle1 = "font-size: 20px;font-weight: 600;color: rgb(244,167,89);";
  const styleTitle2 = "font-size:12px;color: rgb(244,167,89);";
  const styleContent = "color: rgb(30,152,255);";
  const title1 = "無名の主页";
  const title2 = `
 _____ __  __  _______     ____     __
|_   _|  \\/  |/ ____\\ \\   / /\\ \\   / /
  | | | \\  / | (___  \\ \\_/ /  \\ \\_/ /
  | | | |\\/| |\\___ \\  \\   /    \\   /
 _| |_| |  | |____) |  | |      | |
|_____|_|  |_|_____/   |_|      |_|`;
  const content = `\n\n版本: ${config.version}\n主页: ${config.home}\nGithub: ${config.github}`;
  console.info(`%c${title1} %c${title2} %c${content}`, styleTitle1, styleTitle2, styleContent);
});

onBeforeUnmount(() => {
  if (backgroundPreviewTimer) {
    clearTimeout(backgroundPreviewTimer);
  }
  window.removeEventListener("resize", getWidth);
});
</script>

<style lang="scss" scoped>
#main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scale(1.2);
  transition: transform 0.3s;
  animation: fade-blur-main-in 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.5s;
  .container {
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    transition:
      opacity 1.65s ease,
      transform 1.95s cubic-bezier(0.22, 1, 0.36, 1),
      filter 1.65s ease;
    &.hidden {
      opacity: 0;
      transform: scale(0.968);
      filter: blur(12px);
      pointer-events: none;
    }
    .all {
      width: 100%;
      height: 100%;
      padding: 0 0.75rem;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .more {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #00000080;
      backdrop-filter: blur(20px);
      z-index: 2;
      animation: fade 0.5s;
    }
    @media (max-width: 1200px) {
      padding: 0 2vw;
    }
  }
  .menu {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 84%;
    left: calc(50% - 28px);
    width: 56px;
    height: 34px;
    background: rgb(0 0 0 / 20%);
    backdrop-filter: blur(10px);
    border-radius: 6px;
    transition: transform 0.3s;
    animation: fade 0.5s;
    transition:
      opacity 1.3s ease,
      transform 1.35s ease,
      filter 1.3s ease;
    &.hidden {
      opacity: 0;
      transform: translateY(26px) scale(0.93);
      filter: blur(10px);
      pointer-events: none;
    }
    &:active {
      transform: scale(0.95);
    }
    .i-icon {
      transform: translateY(2px);
    }
    @media (min-width: 721px) {
      display: none;
    }
  }
  .bg-glow-trigger {
    position: fixed;
    left: 50%;
    bottom: 112px;
    width: 14px;
    height: 14px;
    border: 0;
    border-radius: 999px;
    padding: 0;
    z-index: 4;
    cursor: pointer;
    transform: translateX(-50%);
    background:
      radial-gradient(circle, rgba(255, 248, 214, 0.95) 0%, rgba(255, 209, 96, 0.9) 38%, rgba(255, 180, 76, 0.18) 68%, rgba(255, 180, 76, 0) 100%);
    box-shadow:
      0 0 10px rgba(255, 214, 120, 0.75),
      0 0 22px rgba(255, 186, 87, 0.45);
    animation: glow-pulse 2.4s ease-in-out infinite;
    transition:
      transform 0.25s ease,
      opacity 1s ease,
      filter 1s ease;
    &.hidden {
      opacity: 0;
      filter: blur(6px);
      pointer-events: none;
    }
    &:hover {
      transform: translateX(-50%) scale(1.15);
    }
    &:active {
      transform: translateX(-50%) scale(0.92);
    }
    @media (max-width: 720px) {
      bottom: 92px;
    }
  }
  .preview-curtain {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 50vw;
    z-index: 3;
    pointer-events: none;
    opacity: 0;
    backdrop-filter: blur(10px);
    background: linear-gradient(90deg, rgba(18, 14, 30, 0.22) 0%, rgba(18, 14, 30, 0.06) 100%);
    &.active {
      opacity: 1;
      animation-duration: 2.35s;
      animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
      animation-fill-mode: forwards;
    }
  }
  .preview-curtain-left {
    left: 0;
    transform-origin: left center;
    clip-path: inset(0 0 0 0);
    &.active {
      animation-name: preview-split-left;
    }
  }
  .preview-curtain-right {
    right: 0;
    transform-origin: right center;
    clip-path: inset(0 0 0 0);
    background: linear-gradient(270deg, rgba(18, 14, 30, 0.22) 0%, rgba(18, 14, 30, 0.06) 100%);
    &.active {
      animation-name: preview-split-right;
    }
  }
}

@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.55;
    box-shadow:
      0 0 8px rgba(255, 214, 120, 0.55),
      0 0 16px rgba(255, 186, 87, 0.28);
  }
  50% {
    opacity: 1;
    box-shadow:
      0 0 12px rgba(255, 225, 146, 0.9),
      0 0 28px rgba(255, 196, 95, 0.52);
  }
}

@keyframes preview-split-left {
  0% {
    opacity: 0;
    transform: translateX(0);
  }
  28% {
    opacity: 0.96;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-100%);
  }
}

@keyframes preview-split-right {
  0% {
    opacity: 0;
    transform: translateX(0);
  }
  28% {
    opacity: 0.96;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}
</style>
