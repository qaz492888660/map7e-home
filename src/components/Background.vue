<template>
  <div :class="store.backgroundShow ? 'cover show' : 'cover'">
    <div class="bg-layer" :style="bgLayerStyle">
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
    <div :class="store.backgroundShow ? 'gray hidden' : 'gray'" />
  </div>
</template>

<script setup>
import { mainStore } from "@/store";
import { Error } from "@icon-park/vue-next";

const store = mainStore();
const bgUrl = ref(null);
const imgTimeout = ref(null);
const emit = defineEmits(["loadComplete"]);

const localSceneBg = "/images/background-kame-4k.jpg";
const maxShiftX = 8;
const currentShiftX = ref(0);
const targetShiftX = ref(0);
let motionFrame = null;

const bgLayerStyle = computed(() => ({
  transform: `translate3d(${currentShiftX.value}px, 0, 0) scale(1.01)`,
}));

const animateMotion = () => {
  const delta = targetShiftX.value - currentShiftX.value;
  currentShiftX.value += delta * 0.08;

  if (Math.abs(delta) > 0.1) {
    motionFrame = requestAnimationFrame(animateMotion);
    return;
  }

  currentShiftX.value = targetShiftX.value;
  motionFrame = null;
};

const updateMotion = (clientX) => {
  if (!window.innerWidth) return;
  const ratio = clientX / window.innerWidth - 0.5;
  targetShiftX.value = ratio * -2 * maxShiftX;

  if (!motionFrame) {
    motionFrame = requestAnimationFrame(animateMotion);
  }
};

const resetMotion = () => {
  targetShiftX.value = 0;
  if (!motionFrame) {
    motionFrame = requestAnimationFrame(animateMotion);
  }
};

const handleMouseMove = (event) => {
  updateMotion(event.clientX);
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
  window.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseleave", resetMotion);
  window.addEventListener("blur", resetMotion);
});

onBeforeUnmount(() => {
  clearTimeout(imgTimeout.value);
  window.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseleave", resetMotion);
  window.removeEventListener("blur", resetMotion);
  if (motionFrame) {
    cancelAnimationFrame(motionFrame);
    motionFrame = null;
  }
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

  .bg-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    will-change: transform;
    transition: transform 0.18s ease-out;
  }

  .bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    backface-visibility: hidden;
    filter: brightness(0.96) saturate(1.02) contrast(1.01);
    animation: fade 0.9s ease forwards;
  }

  .gray {
    opacity: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image:
      radial-gradient(circle at center, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.16) 100%),
      linear-gradient(180deg, rgba(24, 18, 46, 0.02) 0%, rgba(24, 18, 46, 0.1) 100%);
    transition: 1.5s;

    &.hidden {
      opacity: 0;
      transition: 1.5s;
    }
  }
}
</style>
