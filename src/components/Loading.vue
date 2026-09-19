<template>
  <div id="loader-wrapper" :class="{ loaded: store.imgLoadStatus }">
    <div class="cloud-curtain cloud-curtain-top" aria-hidden="true">
      <div class="cloud-haze haze-top" />
      <div class="cloud cloud-a" />
      <div class="cloud cloud-b" />
      <div class="cloud cloud-c" />
      <div class="cloud cloud-d" />
      <div class="cloud cloud-e" />
    </div>

    <div class="cloud-curtain cloud-curtain-bottom" aria-hidden="true">
      <div class="cloud-haze haze-bottom" />
      <div class="cloud cloud-f" />
      <div class="cloud cloud-g" />
      <div class="cloud cloud-h" />
      <div class="cloud cloud-i" />
      <div class="cloud cloud-j" />
    </div>

    <div class="cloud-mist cloud-mist-one" aria-hidden="true" />
    <div class="cloud-mist cloud-mist-two" aria-hidden="true" />

    <div class="loader">
      <div class="loader-circle" />
      <div class="loader-text">
        <span class="name">{{ siteName }}</span>
        <span class="tip">加载中</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { mainStore } from "@/store";

const store = mainStore();
const siteName = import.meta.env.VITE_SITE_NAME;
</script>

<style lang="scss" scoped>
#loader-wrapper {
  position: fixed;
  inset: 0;
  z-index: 999;
  overflow: hidden;
  pointer-events: auto;
  background:
    radial-gradient(circle at 50% 46%, rgba(230, 238, 246, 0.34), transparent 31%),
    linear-gradient(180deg, #8f9aa4 0%, #b5bec6 48%, #9ea8b1 100%);
  opacity: 1;
  visibility: visible;
  transition:
    opacity 0.45s 1.15s ease,
    visibility 0s 1.65s;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    background:
      linear-gradient(180deg, rgba(25, 34, 42, 0.2), transparent 28%, transparent 72%, rgba(23, 31, 38, 0.18)),
      radial-gradient(circle at center, transparent 18%, rgba(24, 31, 38, 0.1) 100%);
  }

  .loader {
    position: absolute;
    inset: 0;
    z-index: 6;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition:
      opacity 0.35s ease,
      transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);

    .loader-circle {
      position: relative;
      width: 132px;
      height: 132px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.18);
      border-top-color: rgba(255, 255, 255, 0.96);
      border-right-color: rgba(255, 255, 255, 0.45);
      animation: spin 1.55s linear infinite;
      filter: drop-shadow(0 0 18px rgba(255, 255, 255, 0.18));

      &::before,
      &::after {
        content: "";
        position: absolute;
        border-radius: 50%;
        border: 2px solid transparent;
      }

      &::before {
        inset: 9px;
        border-top-color: rgba(239, 244, 248, 0.8);
        border-left-color: rgba(239, 244, 248, 0.22);
        animation: spin-reverse 0.85s linear infinite;
      }

      &::after {
        inset: 22px;
        border-top-color: rgba(255, 255, 255, 0.58);
        animation: spin 1.1s linear infinite;
      }
    }

    .loader-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 34px;
      color: #fff;
      text-shadow: 0 2px 18px rgba(24, 31, 38, 0.45);

      .name {
        font-size: 24px;
        font-weight: 600;
        letter-spacing: 0.06em;
      }

      .tip {
        margin-top: 7px;
        font-size: 15px;
        letter-spacing: 0.16em;
        opacity: 0.68;
      }
    }
  }

  .cloud-curtain {
    position: absolute;
    left: -8%;
    width: 116%;
    height: 58%;
    z-index: 3;
    overflow: hidden;
    will-change: transform, opacity, filter;
    transform: translate3d(0, 0, 0) scale(1.03);
    transition:
      transform 1.35s cubic-bezier(0.7, 0, 0.18, 1),
      opacity 1.05s 0.16s ease,
      filter 1.1s ease;

    &::before,
    &::after {
      content: "";
      position: absolute;
      left: -8%;
      width: 116%;
      height: 72%;
      border-radius: 50%;
      pointer-events: none;
    }

    &::before {
      background:
        radial-gradient(ellipse at 8% 70%, rgba(250, 252, 253, 0.95) 0 13%, transparent 27%),
        radial-gradient(ellipse at 25% 52%, rgba(235, 241, 245, 0.98) 0 18%, transparent 34%),
        radial-gradient(ellipse at 48% 66%, rgba(247, 249, 251, 0.97) 0 20%, transparent 37%),
        radial-gradient(ellipse at 70% 48%, rgba(226, 233, 238, 0.98) 0 18%, transparent 35%),
        radial-gradient(ellipse at 91% 69%, rgba(246, 249, 251, 0.96) 0 15%, transparent 31%);
      filter: blur(14px);
      opacity: 0.96;
    }

    &::after {
      background:
        radial-gradient(ellipse at 15% 50%, rgba(183, 195, 204, 0.76) 0 12%, transparent 29%),
        radial-gradient(ellipse at 41% 58%, rgba(204, 213, 220, 0.72) 0 17%, transparent 34%),
        radial-gradient(ellipse at 66% 45%, rgba(175, 187, 196, 0.7) 0 14%, transparent 31%),
        radial-gradient(ellipse at 86% 56%, rgba(211, 219, 224, 0.73) 0 14%, transparent 31%);
      filter: blur(18px);
      opacity: 0.82;
      mix-blend-mode: multiply;
    }
  }

  .cloud-curtain-top {
    top: -8%;
    background:
      linear-gradient(180deg, rgba(175, 186, 195, 0.96), rgba(210, 218, 224, 0.9) 65%, rgba(230, 235, 239, 0.68));

    &::before {
      bottom: -9%;
      animation: cloud-swell-top 7s ease-in-out infinite alternate;
    }

    &::after {
      bottom: -1%;
      animation: cloud-drift-right 12s ease-in-out infinite alternate;
    }
  }

  .cloud-curtain-bottom {
    bottom: -8%;
    background:
      linear-gradient(0deg, rgba(169, 181, 190, 0.97), rgba(207, 215, 221, 0.91) 65%, rgba(229, 234, 238, 0.7));

    &::before {
      top: -9%;
      transform: rotate(180deg);
      animation: cloud-swell-bottom 7.5s ease-in-out infinite alternate;
    }

    &::after {
      top: -1%;
      transform: rotate(180deg);
      animation: cloud-drift-left 13s ease-in-out infinite alternate;
    }
  }

  .cloud-haze {
    position: absolute;
    left: -15%;
    width: 130%;
    height: 55%;
    z-index: 1;
    border-radius: 50%;
    opacity: 0.78;
    filter: blur(28px);
    background:
      radial-gradient(ellipse at 12% 52%, rgba(255, 255, 255, 0.9) 0 12%, transparent 29%),
      radial-gradient(ellipse at 35% 48%, rgba(230, 236, 241, 0.92) 0 17%, transparent 35%),
      radial-gradient(ellipse at 61% 55%, rgba(250, 252, 253, 0.92) 0 18%, transparent 36%),
      radial-gradient(ellipse at 86% 46%, rgba(225, 233, 238, 0.9) 0 16%, transparent 34%);
  }

  .haze-top {
    bottom: -12%;
    animation: haze-drift 9s ease-in-out infinite alternate;
  }

  .haze-bottom {
    top: -12%;
    transform: rotate(180deg);
    animation: haze-drift-reverse 10s ease-in-out infinite alternate;
  }

  .cloud {
    position: absolute;
    z-index: 2;
    width: 250px;
    height: 90px;
    border-radius: 999px;
    background: rgba(242, 246, 249, 0.96);
    box-shadow:
      72px -22px 0 10px rgba(235, 241, 245, 0.96),
      140px 0 0 18px rgba(247, 249, 251, 0.94),
      202px -18px 0 4px rgba(224, 232, 238, 0.92),
      105px 32px 0 18px rgba(218, 227, 233, 0.82);
    filter: blur(8px);
    will-change: transform;
  }

  .cloud-a {
    left: -4%;
    bottom: 1%;
    transform: scale(1.25);
    animation: cloud-float-a 8s ease-in-out infinite alternate;
  }

  .cloud-b {
    left: 20%;
    bottom: 8%;
    transform: scale(1.05);
    opacity: 0.88;
    animation: cloud-float-b 9.5s ease-in-out infinite alternate;
  }

  .cloud-c {
    left: 43%;
    bottom: -2%;
    transform: scale(1.38);
    animation: cloud-float-c 11s ease-in-out infinite alternate;
  }

  .cloud-d {
    right: 14%;
    bottom: 12%;
    transform: scale(0.96);
    opacity: 0.9;
    animation: cloud-float-a 10.5s ease-in-out infinite alternate-reverse;
  }

  .cloud-e {
    right: -7%;
    bottom: -1%;
    transform: scale(1.42);
    animation: cloud-float-b 12s ease-in-out infinite alternate-reverse;
  }

  .cloud-f {
    left: -7%;
    top: 0;
    transform: scale(1.42);
    animation: cloud-float-c 10s ease-in-out infinite alternate;
  }

  .cloud-g {
    left: 18%;
    top: 10%;
    transform: scale(0.98);
    opacity: 0.9;
    animation: cloud-float-a 11s ease-in-out infinite alternate-reverse;
  }

  .cloud-h {
    left: 42%;
    top: -4%;
    transform: scale(1.32);
    animation: cloud-float-b 9s ease-in-out infinite alternate;
  }

  .cloud-i {
    right: 13%;
    top: 8%;
    transform: scale(1.04);
    opacity: 0.9;
    animation: cloud-float-c 12s ease-in-out infinite alternate-reverse;
  }

  .cloud-j {
    right: -7%;
    top: 0;
    transform: scale(1.4);
    animation: cloud-float-a 10s ease-in-out infinite alternate;
  }

  .cloud-mist {
    position: absolute;
    left: -15%;
    width: 130%;
    height: 42%;
    z-index: 4;
    pointer-events: none;
    opacity: 0.7;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(255, 255, 255, 0.44), transparent 42%),
      radial-gradient(ellipse at 52% 54%, rgba(235, 241, 245, 0.56), transparent 46%),
      radial-gradient(ellipse at 84% 48%, rgba(255, 255, 255, 0.42), transparent 40%);
    filter: blur(26px);
    will-change: transform, opacity;
    transition:
      transform 1.2s cubic-bezier(0.7, 0, 0.18, 1),
      opacity 0.7s ease;
  }

  .cloud-mist-one {
    top: 29%;
    animation: mist-breathe 6s ease-in-out infinite alternate;
  }

  .cloud-mist-two {
    top: 42%;
    opacity: 0.48;
    transform: scaleX(1.08);
    animation: mist-breathe-reverse 7s ease-in-out infinite alternate;
  }

  &.loaded {
    pointer-events: none;
    opacity: 0;
    visibility: hidden;

    .loader {
      opacity: 0;
      transform: scale(0.94);
    }

    .cloud-curtain-top {
      transform: translate3d(0, -112%, 0) scale(1.08);
      opacity: 0.2;
      filter: blur(5px);
    }

    .cloud-curtain-bottom {
      transform: translate3d(0, 112%, 0) scale(1.08);
      opacity: 0.2;
      filter: blur(5px);
    }

    .cloud-mist-one {
      transform: translate3d(-14%, -34%, 0) scale(1.16);
      opacity: 0;
    }

    .cloud-mist-two {
      transform: translate3d(14%, 34%, 0) scale(1.16);
      opacity: 0;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse {
  to {
    transform: rotate(-360deg);
  }
}

@keyframes cloud-drift-right {
  from {
    transform: translate3d(-1.5%, 0, 0);
  }
  to {
    transform: translate3d(2.5%, -2%, 0);
  }
}

@keyframes cloud-drift-left {
  from {
    transform: rotate(180deg) translate3d(-1.5%, 0, 0);
  }
  to {
    transform: rotate(180deg) translate3d(2.5%, -2%, 0);
  }
}

@keyframes cloud-swell-top {
  from {
    transform: translate3d(-1%, 2%, 0) scale(1);
  }
  to {
    transform: translate3d(1.5%, -2%, 0) scale(1.04);
  }
}

@keyframes cloud-swell-bottom {
  from {
    transform: rotate(180deg) translate3d(-1%, 2%, 0) scale(1);
  }
  to {
    transform: rotate(180deg) translate3d(1.5%, -2%, 0) scale(1.04);
  }
}

@keyframes haze-drift {
  from {
    transform: translate3d(-1.5%, 1%, 0) scale(1.02);
  }
  to {
    transform: translate3d(2%, -2%, 0) scale(1.06);
  }
}

@keyframes haze-drift-reverse {
  from {
    transform: rotate(180deg) translate3d(-1.5%, 1%, 0) scale(1.02);
  }
  to {
    transform: rotate(180deg) translate3d(2%, -2%, 0) scale(1.06);
  }
}

@keyframes cloud-float-a {
  from {
    translate: -10px 4px;
  }
  to {
    translate: 18px -8px;
  }
}

@keyframes cloud-float-b {
  from {
    translate: 12px -2px;
  }
  to {
    translate: -18px 8px;
  }
}

@keyframes cloud-float-c {
  from {
    translate: -6px -4px;
  }
  to {
    translate: 14px 10px;
  }
}

@keyframes mist-breathe {
  from {
    transform: translate3d(-1%, 1%, 0) scale(1);
  }
  to {
    transform: translate3d(2%, -1%, 0) scale(1.05);
  }
}

@keyframes mist-breathe-reverse {
  from {
    transform: translate3d(2%, -1%, 0) scale(1.03);
  }
  to {
    transform: translate3d(-2%, 1%, 0) scale(1.08);
  }
}

@media (max-width: 720px) {
  #loader-wrapper {
    .loader {
      .loader-circle {
        width: 108px;
        height: 108px;
      }

      .loader-text {
        margin-top: 28px;

        .name {
          font-size: 21px;
        }

        .tip {
          font-size: 14px;
        }
      }
    }

    .cloud {
      width: 190px;
      height: 72px;
      box-shadow:
        54px -18px 0 8px rgba(235, 241, 245, 0.96),
        108px 0 0 14px rgba(247, 249, 251, 0.94),
        155px -14px 0 3px rgba(224, 232, 238, 0.92),
        80px 25px 0 14px rgba(218, 227, 233, 0.82);
    }

    .cloud-curtain {
      left: -18%;
      width: 136%;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  #loader-wrapper {
    .loader-circle,
    .loader-circle::before,
    .loader-circle::after,
    .cloud-curtain::before,
    .cloud-curtain::after,
    .cloud,
    .cloud-haze,
    .cloud-mist {
      animation: none !important;
    }

    .cloud-curtain,
    .cloud-mist,
    .loader {
      transition-duration: 0.35s !important;
    }
  }
}
</style>
