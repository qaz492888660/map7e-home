<template>
  <!-- 加载 -->
  <Loading />
  <!-- 壁纸 -->
  <Background @loadComplete="loadComplete" />
  <!-- 主界面 -->
  <Transition name="fade" mode="out-in">
    <main id="main" :class="{ 'previewing-bg': previewActive }" v-if="store.imgLoadStatus">
      <div class="preview-overlay" :class="{ active: previewActive }" />
      <div class="container" :class="{ hidden: previewContentHidden }">
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
        :class="{ hidden: previewContentHidden }"
        @click="store.mobileOpenState = !store.mobileOpenState"
      >
        <component :is="store.mobileOpenState ? CloseSmall : HamburgerButton" />
      </Icon>
      <!-- 页脚 -->
      <Transition name="fade" mode="out-in">
        <Footer :class="{ hidden: previewContentHidden || store.setOpenState }" />
      </Transition>
      <button
        class="bg-glow-trigger"
        :class="{ active: previewActive }"
        type="button"
        aria-label="切换背景预览"
        @click="previewBackground"
      >
        <span class="bg-glow-core" />
        <span class="bg-glow-label">{{ previewActive ? "返回主页" : "" }}</span>
      </button>
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
let backgroundRevealTimer = null;
let backgroundFadeTimer = null;
const previewActive = ref(false);
const previewContentHidden = ref(false);

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
  if (backgroundRevealTimer) {
    clearTimeout(backgroundRevealTimer);
    backgroundRevealTimer = null;
  }
  if (backgroundFadeTimer) {
    clearTimeout(backgroundFadeTimer);
    backgroundFadeTimer = null;
  }
  if (previewActive.value) {
    previewContentHidden.value = false;
    store.backgroundShow = false;
    previewActive.value = false;
    return;
  }
  previewActive.value = true;
  backgroundFadeTimer = setTimeout(() => {
    previewContentHidden.value = true;
    backgroundFadeTimer = null;
  }, 120);
  backgroundRevealTimer = setTimeout(() => {
    store.backgroundShow = true;
    backgroundRevealTimer = null;
  }, 900);
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
  if (backgroundRevealTimer) {
    clearTimeout(backgroundRevealTimer);
  }
  if (backgroundFadeTimer) {
    clearTimeout(backgroundFadeTimer);
  }
  window.removeEventListener("resize", getWidth);
});
</script>

<style lang="scss" scoped>
#main {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  .container {
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    transition:
      opacity 1.65s ease,
      transform 1.95s cubic-bezier(0.22, 1, 0.36, 1),
      filter 1.65s ease;
    &:not(.hidden) {
      opacity: 1;
      transform: translateY(0) scale(1);
      animation: cinematic-content-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.55s backwards;
    }
    &.hidden {
      opacity: 0;
      transform: scale(0.968);
      filter: none;
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
      backdrop-filter: none;
      z-index: 2;
      animation: fade 0.5s;
    }
    @media (max-width: 1200px) {
      padding: 0 2vw;
    }
  }
  :deep(.left),
  :deep(.right),
  :deep(.box) {
    opacity: 1;
    animation: cinematic-layer-fade-in 0.9s ease 0.65s backwards;
  }
  :deep(.right) {
    animation-delay: 0.78s;
  }
  :deep(.box) {
    animation-delay: 0.82s;
  }
  :deep(#footer) {
    opacity: 1;
    animation: cinematic-layer-fade-in 0.85s ease 0.88s backwards;
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
    backdrop-filter: none;
    border-radius: 6px;
    transition: transform 0.3s;
    opacity: 1;
    animation: cinematic-menu-in 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.9s backwards;
    transition:
      opacity 1.3s ease,
      transform 1.35s ease,
      filter 1.3s ease;
    &.hidden {
      opacity: 0;
      transform: translateY(26px) scale(0.93);
      filter: none;
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
    bottom: 104px;
    width: 28px;
    height: 28px;
    border: 2px solid rgba(255, 246, 214, 0.68);
    border-radius: 999px;
    padding: 0;
    z-index: 12;
    cursor: pointer;
    transform: translateX(-50%);
    isolation: isolate;
    background: rgba(21, 16, 30, 0.24);
    backdrop-filter: none;
    box-shadow:
      0 0 0 6px rgba(255, 219, 132, 0.1),
      0 0 18px rgba(255, 214, 120, 0.42),
      inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    animation:
      cinematic-glow-trigger-in 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.95s backwards,
      glow-pulse 2.4s ease-in-out 1.8s infinite;
    transition:
      transform 0.25s ease,
      opacity 1s ease,
      filter 1s ease,
      padding 0.35s ease,
      gap 0.35s ease,
      width 0.35s ease,
      height 0.35s ease,
      border-color 0.35s ease,
      background-color 0.35s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    .bg-glow-core {
      width: 12px;
      height: 12px;
      border-radius: 999px;
      background: rgba(255, 248, 214, 0.96);
      box-shadow: 0 0 12px rgba(255, 230, 154, 0.9);
    }
    .bg-glow-label {
      max-width: 0;
      overflow: hidden;
      white-space: nowrap;
      color: rgba(255, 248, 226, 0.96);
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.04em;
      opacity: 0;
      transition:
        max-width 0.35s ease,
        opacity 0.25s ease;
    }
    &.active {
      width: auto;
      min-width: 136px;
      height: 46px;
      padding: 0 16px 0 12px;
      gap: 12px;
      opacity: 1;
      border-color: rgba(255, 247, 214, 0.95);
      background: rgba(17, 12, 25, 0.8);
      box-shadow:
        0 0 0 10px rgba(255, 231, 168, 0.14),
        0 0 30px rgba(255, 236, 173, 0.98),
        0 0 60px rgba(255, 210, 120, 0.74);
      .bg-glow-core {
        width: 16px;
        height: 16px;
        background: rgba(255, 250, 232, 0.98);
        box-shadow: 0 0 18px rgba(255, 239, 183, 1);
      }
      .bg-glow-label {
        max-width: 110px;
        opacity: 1;
      }
    }
    &:hover {
      transform: translateX(-50%) scale(1.15);
    }
    &:active {
      transform: translateX(-50%) scale(0.92);
    }
    @media (max-width: 720px) {
      bottom: 88px;
      &.active {
        min-width: 124px;
        height: 42px;
        padding: 0 14px 0 10px;
        .bg-glow-label {
          font-size: 13px;
          max-width: 96px;
        }
      }
    }
  }
  .preview-overlay {
    position: fixed;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    opacity: 0;
    backdrop-filter: none;
    background:
      radial-gradient(circle at center, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 26%, rgba(18, 14, 30, 0.08) 58%, rgba(18, 14, 30, 0.02) 100%);
    &.active {
      animation: preview-overlay-fade 2.1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
    }
  }
}

@keyframes cinematic-content-in {
  0% {
    opacity: 0;
    transform: translateY(24px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes cinematic-layer-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes cinematic-menu-in {
  0% {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes cinematic-glow-trigger-in {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(16px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
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

@keyframes preview-overlay-fade {
  0% {
    opacity: 0;
    transform: scale(1.015);
  }
  35% {
    opacity: 0.92;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.995);
  }
}
</style>
