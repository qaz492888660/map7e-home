<template>
  <div class="message">
    <button class="logo" type="button" @click="handleAvatarClick">
      <div
        class="logo-card"
        :class="{
          flipped,
          unlocked,
          pressing: isPressing,
        }"
      >
        <div class="logo-face logo-front">
          <img class="logo-img" :src="siteLogo" alt="avatar front" />
        </div>
        <div class="logo-face logo-back">
          <img class="logo-img" :src="avatarBack" alt="avatar back" />
        </div>
      </div>
    </button>
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
import avatarBack from "@/assets/images/avatar-back.jpg";

const store = mainStore();
const motto = "须知少年拏云志，曾许人间第一流。";
const mottoChars = Array.from(motto);
const visibleCount = ref(0);
const openingDelayMs = 1600;
const charStepMs = 180;
const clausePauseMs = 700;
const loopGapMs = 10000;
const pauseAfterLength = Array.from("须知少年拏云志，").length;

const clickCount = ref(0);
const unlocked = ref(false);
const flipped = ref(false);
const hasShownMessage = ref(false);
const isPressing = ref(false);

const pressDurationMs = 160;
const clickThrottleMs = 150;

let revealTimer = null;
let loopTimer = null;
let pressTimer = null;
let clickThrottleTimer = null;
let clickLocked = false;

const triggerPressFeedback = () => {
  isPressing.value = false;
  if (pressTimer) {
    clearTimeout(pressTimer);
  }
  requestAnimationFrame(() => {
    isPressing.value = true;
    pressTimer = setTimeout(() => {
      isPressing.value = false;
      pressTimer = null;
    }, pressDurationMs);
  });
};

const handleAvatarClick = () => {
  if (clickLocked) {
    return;
  }
  clickLocked = true;
  clickThrottleTimer = setTimeout(() => {
    clickLocked = false;
    clickThrottleTimer = null;
  }, clickThrottleMs);

  triggerPressFeedback();

  if (!unlocked.value) {
    clickCount.value += 1;
    if (clickCount.value === 7) {
      unlocked.value = true;
      flipped.value = true;
      if (!hasShownMessage.value) {
        ElMessage({
          message: "恭喜你，找到了本站宝藏！！",
          grouping: true,
        });
        hasShownMessage.value = true;
      }
    }
    return;
  }

  flipped.value = !flipped.value;
};

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
  if (pressTimer) {
    clearTimeout(pressTimer);
  }
  if (clickThrottleTimer) {
    clearTimeout(clickThrottleTimer);
  }
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
    display: flex;
    justify-content: center;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    perspective: 1600px;
    -webkit-tap-highlight-color: transparent;

    .logo-card {
      position: relative;
      width: 220px;
      height: 220px;
      transform-style: preserve-3d;
      --card-rotate: 0deg;
      --card-scale: 1;
      transition:
        transform 1s cubic-bezier(0.22, 0.61, 0.36, 1),
        box-shadow 0.24s ease;
      border-radius: 28px;
      box-shadow:
        0 14px 30px rgba(15, 18, 38, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.16);

      transform: rotateY(var(--card-rotate)) scale(var(--card-scale));
      will-change: transform;

      &.flipped {
        --card-rotate: 180deg;
      }

      &.pressing {
        --card-scale: 0.96;
      }

    }

    .logo-face {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 28px;
      overflow: hidden;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      transform-style: preserve-3d;
    }

    .logo-front {
      transform: rotateY(0deg);
      z-index: 2;
    }

    .logo-back {
      transform: rotateY(180deg);
      z-index: 1;
    }

    .logo-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 28px;
      display: block;
      user-select: none;
      pointer-events: none;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }

    &:focus-visible .logo-card {
      outline: 2px solid rgba(255, 255, 255, 0.55);
      outline-offset: 6px;
    }

    @media (max-width: 768px) {
      .logo-card {
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
      pointer-events: none;
    }
  }

  @media (max-width: 390px) {
    .logo {
      .logo-card {
        width: 150px;
        height: 150px;
        border-radius: 22px;
      }

      .logo-face,
      .logo-img {
        border-radius: 22px;
      }
    }

    .description {
      margin-top: 2.5rem;
    }
  }
}
</style>
