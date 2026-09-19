<template>
  <div id="loader-wrapper" :class="{ loaded: store.imgLoadStatus }">
    <div class="loader-scene" aria-hidden="true">
      <img class="loader-scene-image" :src="loadingBg" alt="" />
      <div class="loader-scene-glow" />
    </div>

    <div class="cloud-curtain cloud-curtain-left" aria-hidden="true">
      <div class="cloud-knot knot-1"><span /></div>
      <div class="cloud-knot knot-2"><span /></div>
      <div class="cloud-knot knot-3"><span /></div>
      <div class="cloud-knot knot-4"><span /></div>
      <div class="cloud-knot knot-5"><span /></div>
      <div class="cloud-knot knot-6"><span /></div>
      <div class="cloud-knot knot-7"><span /></div>
    </div>

    <div class="cloud-curtain cloud-curtain-right" aria-hidden="true">
      <div class="cloud-knot knot-1"><span /></div>
      <div class="cloud-knot knot-2"><span /></div>
      <div class="cloud-knot knot-3"><span /></div>
      <div class="cloud-knot knot-4"><span /></div>
      <div class="cloud-knot knot-5"><span /></div>
      <div class="cloud-knot knot-6"><span /></div>
      <div class="cloud-knot knot-7"><span /></div>
    </div>

    <div class="loader">
      <div class="loader-circle" aria-hidden="true">
        <span class="loader-ring ring-dark" />
        <span class="loader-ring ring-gold" />
      </div>

      <div class="loader-text">
        <span class="name">{{ siteName }}</span>
        <span class="tip"><i />加载中<i /></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { mainStore } from "@/store";
import loadingBg from "@/assets/images/background-kame-4k.jpg";

const store = mainStore();
const siteName = import.meta.env.VITE_SITE_NAME || "MAP7E";
</script>

<style lang="scss" scoped>
#loader-wrapper {
  --ink: #263d59;
  --ink-soft: #36506d;
  --gold-1: #fff2a4;
  --gold-2: #ffe06a;
  --gold-3: #ffc94a;
  --gold-4: #f5aa31;
  --gold-5: #ec8e2d;

  position: fixed;
  inset: 0;
  z-index: 999;
  overflow: hidden;
  background: #6d91d8;
  pointer-events: auto;
  opacity: 1;
  visibility: visible;
  isolation: isolate;
  transition:
    opacity 0.42s 1.03s ease,
    visibility 0s 1.46s;

  .loader-scene {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    background: #6d91d8;

    .loader-scene-image {
      position: absolute;
      inset: -2%;
      width: 104%;
      height: 104%;
      object-fit: cover;
      object-position: center center;
      transform: scale(1.055);
      filter: saturate(1.03) brightness(1.03);
      animation: scene-breathe 4.8s ease-in-out infinite alternate;
    }

    .loader-scene-glow {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(
          circle at 50% 48%,
          rgba(255, 239, 185, 0.25) 0%,
          rgba(255, 225, 155, 0.1) 24%,
          transparent 48%
        ),
        linear-gradient(
          180deg,
          rgba(29, 54, 104, 0.08) 0%,
          transparent 34%,
          rgba(255, 170, 101, 0.05) 66%,
          rgba(16, 32, 58, 0.08) 100%
        );
    }
  }

  .loader {
    position: absolute;
    inset: 0;
    z-index: 6;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transform: translateY(-2vh);
    transition:
      opacity 0.3s ease,
      transform 0.48s cubic-bezier(0.22, 1, 0.36, 1);

    .loader-circle {
      position: relative;
      width: 104px;
      height: 104px;
      filter:
        drop-shadow(0 0 10px rgba(255, 244, 199, 0.95))
        drop-shadow(0 6px 18px rgba(34, 52, 78, 0.18));

      .loader-ring {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 10px solid transparent;
        box-sizing: border-box;
      }

      .ring-dark {
        border-top-color: var(--ink);
        border-left-color: var(--ink);
        transform: rotate(-34deg);
        animation: spin 1.35s linear infinite;
      }

      .ring-gold {
        inset: 9px;
        border-width: 9px;
        border-right-color: #f6b927;
        border-bottom-color: #ffd657;
        transform: rotate(-24deg);
        animation: spin-reverse 1.05s linear infinite;
      }

      &::after {
        content: "";
        position: absolute;
        inset: 26px;
        border-radius: 50%;
        background: rgba(255, 245, 208, 0.2);
        box-shadow:
          inset 0 0 18px rgba(255, 255, 255, 0.22),
          0 0 22px rgba(255, 225, 115, 0.2);
      }
    }

    .loader-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 24px;
      padding: 15px 24px 14px;
      border-radius: 22px;
      background: rgba(255, 244, 218, 0.16);
      box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, 0.28),
        0 10px 30px rgba(31, 47, 74, 0.12);
      backdrop-filter: blur(5px);

      .name {
        color: var(--ink);
        font-size: clamp(34px, 6vw, 52px);
        line-height: 1;
        font-weight: 900;
        letter-spacing: 0.045em;
        text-shadow:
          0 2px 0 rgba(255, 249, 222, 0.85),
          0 0 18px rgba(255, 231, 151, 0.45);
      }

      .tip {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 9px;
        color: var(--ink-soft);
        font-size: clamp(15px, 2.7vw, 20px);
        line-height: 1;
        font-weight: 700;
        letter-spacing: 0.13em;
        text-shadow: 0 1px 8px rgba(255, 246, 214, 0.55);

        i {
          width: 26px;
          height: 2px;
          border-radius: 999px;
          background: currentColor;
          opacity: 0.72;
        }
      }
    }
  }

  .cloud-curtain {
    position: absolute;
    top: -5%;
    width: 55%;
    height: 110%;
    z-index: 4;
    pointer-events: none;
    will-change: transform, opacity, filter;
    transition:
      transform 1.12s cubic-bezier(0.7, 0, 0.2, 1),
      opacity 0.72s 0.12s ease,
      filter 0.8s ease;

    &::before {
      content: "";
      position: absolute;
      top: 2%;
      bottom: 2%;
      width: 84%;
      border-radius: 48% 44% 52% 46%;
      opacity: 0.5;
      filter: blur(22px);
      background:
        radial-gradient(circle at 58% 15%, rgba(255, 239, 135, 0.8), transparent 34%),
        radial-gradient(circle at 48% 42%, rgba(255, 204, 73, 0.68), transparent 37%),
        radial-gradient(circle at 54% 72%, rgba(246, 161, 48, 0.55), transparent 42%);
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      width: 26%;
      opacity: 0.56;
      filter: blur(18px);
      background: linear-gradient(
        180deg,
        rgba(255, 242, 160, 0.46),
        rgba(255, 197, 70, 0.38) 50%,
        rgba(240, 145, 42, 0.42)
      );
    }

    .cloud-knot {
      --scale: 1;
      position: absolute;
      width: clamp(170px, 25vw, 310px);
      aspect-ratio: 1.32;
      border-radius: 52% 48% 46% 54% / 58% 52% 48% 42%;
      background:
        radial-gradient(circle at 30% 29%, var(--gold-1) 0 12%, transparent 13%),
        radial-gradient(circle at 51% 24%, var(--gold-2) 0 20%, transparent 21%),
        radial-gradient(circle at 72% 38%, #ffd45a 0 20%, transparent 21%),
        radial-gradient(circle at 30% 60%, #ffd65b 0 25%, transparent 26%),
        radial-gradient(circle at 57% 62%, var(--gold-3) 0 31%, transparent 32%),
        radial-gradient(circle at 78% 70%, var(--gold-4) 0 24%, transparent 25%),
        radial-gradient(ellipse at 48% 58%, var(--gold-4) 0 47%, var(--gold-5) 73%, transparent 74%);
      box-shadow:
        inset 14px 13px 26px rgba(255, 247, 183, 0.66),
        inset -15px -17px 27px rgba(220, 118, 32, 0.18),
        0 0 24px rgba(255, 207, 77, 0.28);
      animation: knot-float 5.6s ease-in-out infinite alternate;

      &::before {
        content: "";
        position: absolute;
        inset: 12% 13%;
        border-radius: 50%;
        background:
          radial-gradient(circle at 50% 50%, transparent 0 19%, rgba(232, 145, 45, 0.18) 20% 27%, transparent 28%),
          conic-gradient(
            from 26deg at 50% 50%,
            transparent 0deg 198deg,
            rgba(234, 146, 44, 0.28) 198deg 246deg,
            transparent 246deg 360deg
          );
        filter: blur(0.2px);
        transform: rotate(-16deg) scale(0.83);
      }

      &::after {
        content: "";
        position: absolute;
        width: 44%;
        aspect-ratio: 1;
        left: 28%;
        top: 29%;
        border-radius: 50%;
        border: clamp(7px, 1vw, 11px) solid rgba(238, 157, 49, 0.44);
        border-right-color: transparent;
        border-bottom-color: transparent;
        transform: rotate(-38deg);
        filter: drop-shadow(0 0 4px rgba(255, 232, 132, 0.32));
      }

      span {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background:
          radial-gradient(circle at 24% 25%, rgba(255, 255, 211, 0.38), transparent 25%),
          radial-gradient(circle at 66% 28%, rgba(255, 247, 180, 0.25), transparent 30%);
        mix-blend-mode: screen;
      }
    }

    .knot-1 {
      top: -2%;
      --scale: 1.08;
    }

    .knot-2 {
      top: 13%;
      --scale: 0.92;
      animation-delay: -1.3s;
    }

    .knot-3 {
      top: 28%;
      --scale: 1.13;
      animation-delay: -2.1s;
    }

    .knot-4 {
      top: 43%;
      --scale: 0.98;
      animation-delay: -0.7s;
    }

    .knot-5 {
      top: 59%;
      --scale: 1.16;
      animation-delay: -2.8s;
    }

    .knot-6 {
      top: 75%;
      --scale: 0.95;
      animation-delay: -1.7s;
    }

    .knot-7 {
      top: 90%;
      --scale: 1.14;
      animation-delay: -3.2s;
    }
  }

  .cloud-curtain-left {
    left: -11%;

    &::before {
      left: -3%;
    }

    &::after {
      left: 0;
    }

    .cloud-knot {
      right: -2%;
    }

    .knot-2,
    .knot-4,
    .knot-6 {
      right: 10%;
    }
  }

  .cloud-curtain-right {
    right: -11%;
    transform: scaleX(-1);

    &::before {
      left: -3%;
    }

    &::after {
      left: 0;
    }

    .cloud-knot {
      right: -2%;
    }

    .knot-2,
    .knot-4,
    .knot-6 {
      right: 10%;
    }
  }

  &.loaded {
    pointer-events: none;
    opacity: 0;
    visibility: hidden;

    .loader {
      opacity: 0;
      transform: translateY(-2vh) scale(0.93);
    }

    .cloud-curtain-left {
      transform: translate3d(-116%, 0, 0) scale(1.04);
      opacity: 0.4;
      filter: blur(3px);
    }

    .cloud-curtain-right {
      transform: translate3d(116%, 0, 0) scaleX(-1) scale(1.04);
      opacity: 0.4;
      filter: blur(3px);
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(-34deg);
  }

  to {
    transform: rotate(326deg);
  }
}

@keyframes spin-reverse {
  from {
    transform: rotate(-24deg);
  }

  to {
    transform: rotate(-384deg);
  }
}

@keyframes scene-breathe {
  from {
    transform: scale(1.055);
  }

  to {
    transform: scale(1.075);
  }
}

@keyframes knot-float {
  from {
    transform: translate3d(-4px, 4px, 0) scale(var(--scale));
  }

  to {
    transform: translate3d(7px, -7px, 0) scale(calc(var(--scale) * 1.025));
  }
}

@media (max-width: 720px) {
  #loader-wrapper {
    .loader {
      transform: translateY(-3vh);

      .loader-circle {
        width: 82px;
        height: 82px;

        .loader-ring {
          border-width: 8px;
        }

        .ring-gold {
          inset: 8px;
          border-width: 8px;
        }

        &::after {
          inset: 21px;
        }
      }

      .loader-text {
        margin-top: 21px;
        padding: 13px 18px 12px;
        border-radius: 19px;

        .name {
          font-size: 31px;
        }

        .tip {
          margin-top: 8px;
          gap: 8px;
          font-size: 15px;

          i {
            width: 20px;
          }
        }
      }
    }

    .cloud-curtain {
      width: 63%;

      .cloud-knot {
        width: clamp(150px, 45vw, 220px);
      }
    }

    .cloud-curtain-left {
      left: -22%;
    }

    .cloud-curtain-right {
      right: -22%;
    }
  }
}

@media (max-width: 420px) {
  #loader-wrapper {
    .cloud-curtain {
      width: 69%;
    }

    .cloud-curtain-left {
      left: -27%;
    }

    .cloud-curtain-right {
      right: -27%;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  #loader-wrapper {
    .loader-scene-image,
    .loader-ring,
    .cloud-knot {
      animation: none !important;
    }

    .cloud-curtain,
    .loader {
      transition-duration: 0.35s !important;
    }
  }
}
</style>
