<template>
  <div class="message">
    <div class="logo">
      <img class="logo-img" :src="siteLogo" alt="logo" />
    </div>
    <div class="description cards" @click="changeBox">
      <div class="content">
        <Icon size="16">
          <QuoteLeft />
        </Icon>
        <div class="text">
          <p class="motto-line">
            <span
              v-for="(char, index) in mottoChars"
              :key="`${char}-${index}`"
              class="motto-char"
              :class="{ visible: index < visibleCount }"
            >
              {{ char === " " ? "\u00A0" : char }}
            </span>
          </p>
        </div>
        <Icon size="16">
          <QuoteRight />
        </Icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@vicons/utils";
import { QuoteLeft, QuoteRight } from "@vicons/fa";
import { Error } from "@icon-park/vue-next";
import { mainStore } from "@/store";
import siteLogo from "@/assets/images/map7e.jpg";

const store = mainStore();
const motto = "须知少年拏云志，曾许人间第一流。";
const mottoChars = Array.from(motto);
const visibleCount = ref(0);
const openingDelayMs = 1600;
const charStepMs = 180;
const clausePauseMs = 700;
const loopGapMs = 10000;
const pauseAfterLength = Array.from("须知少年拏云志，").length;
let revealTimer = null;
let loopTimer = null;

const changeBox = () => {
  if (store.getInnerWidth >= 990) {
    store.boxOpenState = !store.boxOpenState;
  } else {
    ElMessage({
      message: "当前页面宽度不足以开启盒子",
      grouping: true,
      icon: h(Error, {
        theme: "filled",
        fill: "#efefef",
      }),
    });
  }
};

const clearMottoTimers = () => {
  if (revealTimer) {
    clearTimeout(revealTimer);
    revealTimer = null;
  }
  if (loopTimer) {
    clearTimeout(loopTimer);
    loopTimer = null;
  }
};

const startMottoLoop = () => {
  clearMottoTimers();
  visibleCount.value = 0;
  loopTimer = setTimeout(() => {
    const revealNextChar = () => {
      if (visibleCount.value >= mottoChars.length) {
        revealTimer = null;
        loopTimer = setTimeout(startMottoLoop, loopGapMs);
        return;
      }
      visibleCount.value += 1;
      const delay = visibleCount.value === pauseAfterLength ? clausePauseMs : charStepMs;
      revealTimer = setTimeout(revealNextChar, delay);
    };
    revealNextChar();
  }, openingDelayMs);
};

onMounted(() => {
  startMottoLoop();
});

onBeforeUnmount(() => {
  clearMottoTimers();
});
</script>

<style lang="scss" scoped>
.message {
  display: flex;
  flex-direction: column;
  align-items: center;

  .logo {
    animation: fade 0.5s;
    width: 100%;
    max-width: 460px;
    display: flex;
    justify-content: center;

    .logo-img {
      width: 220px;
      height: 220px;
      object-fit: cover;
      border-radius: 28px;
      display: block;
    }

    @media (max-width: 768px) {
      .logo-img {
        width: 180px;
        height: 180px;
      }
    }

    @media (max-width: 720px) {
      max-width: 100%;
    }
  }

  .description {
    padding: 1rem;
    margin-top: 3.5rem;
    width: 100%;
    max-width: 460px;
    animation: fade 0.5s;

    .content {
      display: flex;
      justify-content: space-between;

      .text {
        margin: 0.75rem 1rem;
        line-height: 2rem;
        margin-right: auto;

        .motto-line {
          display: flex;
          flex-wrap: wrap;
          gap: 0.02em;
          font-family: "Pacifico-Regular";
        }

        .motto-char {
          opacity: 0;
          transform: translateY(8px);
          transition:
            opacity 0.35s ease,
            transform 0.35s ease;
        }

        .motto-char.visible {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .xicon:nth-of-type(2) {
        align-self: flex-end;
      }
    }

    @media (max-width: 720px) {
      max-width: 100%;
      pointer-events: none;
    }
  }

  @media (max-width: 390px) {
    .logo {
      .logo-img {
        width: 150px;
        height: 150px;
        border-radius: 22px;
      }
    }

    .description {
      margin-top: 2.5rem;
    }
  }
}
</style>
