<template>
  <div :class="store.backgroundShow ? 'cover show' : 'cover'">
    <img
      v-show="store.imgLoadStatus"
      class="bg"
      alt="cover"
      :src="bgUrl"
      @load="imgLoadComplete"
      @error.once="imgLoadError"
      @animationend="imgAnimationEnd"
    />
  </div>
</template>

<script setup>
import { mainStore } from "@/store";
import { Error } from "@icon-park/vue-next";
import localSceneBg from "@/assets/images/background-kame-4k.jpg";

const store = mainStore();
const bgUrl = ref(null);
const imgTimeout = ref(null);
const bgShiftX = ref("0px");
const mouseOffsetRatio = ref(0);
let frameId = 0;
let currentOffsetRatio = 0;
const emit = defineEmits(["loadComplete"]);

const MAX_SHIFT = 32;

const updateBackgroundShift = () => {
  currentOffsetRatio += (mouseOffsetRatio.value - currentOffsetRatio) * 0.08;
  const offset = currentOffsetRatio * MAX_SHIFT;
  bgShiftX.value = `${offset.toFixed(2)}px`;
  frameId = window.requestAnimationFrame(updateBackgroundShift);
};

const handleMouseMove = (event) => {
  const viewportWidth = window.innerWidth || 1;
  const ratio = event.clientX / viewportWidth;
  mouseOffsetRatio.value = (ratio - 0.5) * 2;
};

const resetMouseShift = () => {
  mouseOffsetRatio.value = 0;
};

const changeBg = (type) => {
  if (type == 0) {
    bgUrl.value = localSceneBg;
  } else if (type == 1) {
    bgUrl.value = "https://api.dujin.org/bing/1920.php";
  } else if (type == 2) {
    bgUrl.value = "https://api.aixiaowai.cn/gqapi/gqapi.php";
  } else if (type == 3) {
    bgUrl.value = "https://api.aixiaowai.cn/api/api.php";
  }
};

const imgLoadComplete = () => {
  imgTimeout.value = setTimeout(() => {
    store.setImgLoadStatus(true);
  }, Math.floor(Math.random() * 301) + 300);
};

const imgAnimationEnd = () => {
  emit("loadComplete");
};

const imgLoadError = () => {
  ElMessage({
    message: "壁纸加载失败，已临时切换回默认背景",
    icon: h(Error, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
  bgUrl.value = localSceneBg;
};

onMounted(() => {
  changeBg(store.coverType);
  window.addEventListener("mousemove", handleMouseMove, { passive: true });
  window.addEventListener("mouseleave", resetMouseShift);
  updateBackgroundShift();
});

onBeforeUnmount(() => {
  clearTimeout(imgTimeout.value);
  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("mouseleave", resetMouseShift);
  window.cancelAnimationFrame(frameId);
});
</script>

<style lang="scss" scoped>
.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: 0.25s;
  z-index: -1;
  overflow: hidden;

  &.show {
    z-index: 1;
  }

  .bg {
    position: absolute;
    top: 0;
    left: -32px;
    width: calc(100% + 64px);
    height: 100%;
    object-fit: cover;
    object-position: center center;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    backface-visibility: visible;
    transform: translate3d(v-bind(bgShiftX), 0, 0);
    scale: 1.08;
    will-change: transform, filter, scale;
    filter: blur(8px) brightness(0.92);
    animation: cinematic-bg-zoom-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.45s forwards;
  }
}

@keyframes cinematic-bg-zoom-in {
  0% {
    scale: 1.08;
    filter: blur(8px) brightness(0.92);
  }
  100% {
    scale: 1;
    filter: blur(0) brightness(1);
  }
}
</style>
