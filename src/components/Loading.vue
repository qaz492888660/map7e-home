<template>
  <div id="loader-wrapper" :class="{ flying: flightActive, finished: flightComplete }">
    <div class="loader-scene" aria-hidden="true">
      <div class="loader-scene-art">
        <img class="loader-scene-image" :src="loadingBg" alt="" />
        <img
          class="loader-sprite-preload"
          :src="gokuSprite"
          alt=""
          @load="spriteReady = true"
          @error="spriteFailed = true"
        />
        <svg
          class="loader-flight-svg"
          :class="{ 'flight-started': flightStarted, settled: flightSettled }"
          viewBox="0 0 3840 2160"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g ref="flightTrailRef" class="flight-trail">
            <path ref="flightPathRef" class="trail-glow" :d="GOKU_FLIGHT_PATH" />
            <path class="trail-body" :d="GOKU_FLIGHT_PATH" />
            <path class="trail-core" :d="GOKU_FLIGHT_PATH" />
          </g>
          <g ref="flightRiderRef" class="flight-rider">
            <g ref="flightPoseRef" class="flight-pose">
              <image
                ref="flightPoseMirroredRef"
                class="flight-pose-mirrored"
                :href="gokuSprite"
                :x="-GOKU_SPRITE_WIDTH / 2"
                :y="-GOKU_SPRITE_HEIGHT / 2"
                :width="GOKU_SPRITE_WIDTH"
                :height="GOKU_SPRITE_HEIGHT"
                transform="scale(-1 1)"
                opacity="1"
                preserveAspectRatio="none"
              />
              <image
                ref="flightPoseInwardRef"
                class="flight-pose-inward"
                :href="gokuSprite"
                :x="-GOKU_SPRITE_WIDTH / 2"
                :y="-GOKU_SPRITE_HEIGHT / 2"
                :width="GOKU_SPRITE_WIDTH"
                :height="GOKU_SPRITE_HEIGHT"
                opacity="0"
                preserveAspectRatio="none"
              />
            </g>
          </g>
          <g ref="foregroundTrailRef" class="foreground-trail">
            <path class="trail-glow" :d="GOKU_FLIGHT_PATH" />
            <path class="trail-body" :d="GOKU_FLIGHT_PATH" />
            <path class="trail-core" :d="GOKU_FLIGHT_PATH" />
          </g>
          <g class="settled-rider">
            <image
              :href="gokuSprite"
              :x="GOKU_FINAL_LEFT"
              :y="GOKU_FINAL_TOP"
              :width="GOKU_SPRITE_WIDTH"
              :height="GOKU_SPRITE_HEIGHT"
              preserveAspectRatio="none"
            />
          </g>
        </svg>
      </div>
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
import loadingBg from "@/assets/images/background-kame-clean.png";
import gokuSprite from "@/assets/images/goku-nimbus.png";
import {
  GOKU_FINAL_X,
  GOKU_FINAL_Y,
  GOKU_FLIGHT_PATH,
  GOKU_SCENE_HEIGHT,
  GOKU_SCENE_WIDTH,
  GOKU_SPRITE_HEIGHT,
  GOKU_SPRITE_WIDTH,
} from "@/utils/gokuFlightPath.js";

const store = mainStore();
const siteName = import.meta.env.VITE_SITE_NAME || "MAP7E";
const emit = defineEmits(["flightComplete"]);
const flightActive = ref(false);
const flightStarted = ref(false);
const flightSettled = ref(false);
const flightComplete = ref(false);
const spriteReady = ref(false);
const spriteFailed = ref(false);
const flightPathRef = ref(null);
const flightTrailRef = ref(null);
const foregroundTrailRef = ref(null);
const flightRiderRef = ref(null);
const flightPoseRef = ref(null);
const flightPoseMirroredRef = ref(null);
const flightPoseInwardRef = ref(null);
let flightFallbackTimer = null;
let flightFrameId = 0;
let pathLength = 0;
let flightStartLength = 0;
let flightStartTime = 0;
let flightDuration = 3100;

// These arclengths bracket the short outside limb of the existing hook. The
// return limb passes within one sprite height of it from 3247 to about 3386.
const FOREGROUND_TRAIL_START = 3167;
const FOREGROUND_TRAIL_END = 3247;
const FOREGROUND_OCCLUSION_START = 3247;
const FOREGROUND_OCCLUSION_FULL = 3265;
const FOREGROUND_OCCLUSION_FADE_START = 3350;
const FOREGROUND_OCCLUSION_END = 3386;
// The existing hook turns from 32° to 136° between these tangent headings.
// Use that real bend to time one short facing crossfade, then hold the native
// left-facing artwork through the inward return limb.
const TURN_START_HEADING_DEG = 32;
const TURN_END_HEADING_DEG = 136;
const MAX_TURN_BANK_DEG = 10;
const smoothstep = (value) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

const completeFlight = () => {
  if (flightComplete.value) return;
  clearTimeout(flightFallbackTimer);
  flightComplete.value = true;
  emit("flightComplete");
};

const setFlightProgress = (progress) => {
  const path = flightPathRef.value;
  const trail = flightTrailRef.value;
  const foregroundTrail = foregroundTrailRef.value;
  const rider = flightRiderRef.value;
  const pose = flightPoseRef.value;
  const mirroredPose = flightPoseMirroredRef.value;
  const inwardPose = flightPoseInwardRef.value;
  if (
    !path ||
    !trail ||
    !foregroundTrail ||
    !rider ||
    !pose ||
    !mirroredPose ||
    !inwardPose ||
    !pathLength
  )
    return;

  const distance = flightStartLength + (pathLength - flightStartLength) * progress;
  const point = path.getPointAtLength(distance);
  const tangentStart = path.getPointAtLength(Math.max(0, distance - 8));
  const tangentEnd = path.getPointAtLength(Math.min(pathLength, distance + 8));
  const tangentHeading =
    (Math.atan2(tangentEnd.y - tangentStart.y, tangentEnd.x - tangentStart.x) * 180) / Math.PI;
  const turnProgress = smoothstep(
    (tangentHeading - TURN_START_HEADING_DEG) / (TURN_END_HEADING_DEG - TURN_START_HEADING_DEG),
  );
  const scale = 0.82 + 0.18 * progress;
  const riderX = progress === 1 ? GOKU_FINAL_X : point.x;
  const riderY = progress === 1 ? GOKU_FINAL_Y : point.y;

  rider.setAttribute("transform", `translate(${riderX} ${riderY}) scale(${scale})`);
  // Keep the mirrored left-to-right entrance, then briefly crossfade into the
  // source's native left-facing pose as the path turns back into its inner arc.
  // A small S-shaped bank suggests the turn without following every tangent.
  mirroredPose.style.opacity = `${1 - turnProgress}`;
  inwardPose.style.opacity = `${turnProgress}`;
  const bank = Math.sin(turnProgress * Math.PI * 2) * MAX_TURN_BANK_DEG;
  pose.setAttribute("transform", `rotate(${bank.toFixed(2)})`);
  trail.style.strokeDashoffset = `${Math.max(0, pathLength - distance)}`;

  const fadeIn = smoothstep(
    (distance - FOREGROUND_OCCLUSION_START) /
      (FOREGROUND_OCCLUSION_FULL - FOREGROUND_OCCLUSION_START),
  );
  const fadeOut = smoothstep(
    (FOREGROUND_OCCLUSION_END - distance) /
      (FOREGROUND_OCCLUSION_END - FOREGROUND_OCCLUSION_FADE_START),
  );
  foregroundTrail.style.opacity = `${Math.min(fadeIn, fadeOut)}`;
};

const findVisiblePathStart = (path, length) => {
  const art = document.querySelector(".loader-scene-art");
  if (!art) return 0;

  const rect = art.getBoundingClientRect();
  const leftEdge = Math.max(0, ((0 - rect.left) / rect.width) * GOKU_SCENE_WIDTH);
  const targetX = Math.max(0, leftEdge - GOKU_SPRITE_WIDTH / 2);
  if (targetX <= 0) return 0;

  const visibleTop = Math.max(0, ((0 - rect.top) / rect.height) * GOKU_SCENE_HEIGHT);
  const visibleBottom = Math.min(
    GOKU_SCENE_HEIGHT,
    ((window.innerHeight - rect.top) / rect.height) * GOKU_SCENE_HEIGHT,
  );

  for (let distance = 0; distance <= length; distance += 4) {
    const point = path.getPointAtLength(distance);
    if (point.x >= targetX && point.y >= visibleTop && point.y <= visibleBottom) {
      return distance;
    }
  }
  return 0;
};

const finishFlight = () => {
  if (flightComplete.value) return;
  if (flightFrameId) cancelAnimationFrame(flightFrameId);
  setFlightProgress(1);
  flightSettled.value = true;
  completeFlight();
};

const beginFlight = async () => {
  if (flightActive.value) return;
  flightActive.value = true;
  flightDuration =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 450 : 3100;

  await nextTick();
  const path = flightPathRef.value;
  const trail = flightTrailRef.value;
  const foregroundTrail = foregroundTrailRef.value;
  if (!path || !trail || !foregroundTrail || typeof path.getTotalLength !== "function") {
    finishFlight();
    return;
  }

  pathLength = path.getTotalLength();
  flightStartLength = findVisiblePathStart(path, pathLength);
  trail.style.strokeDasharray = `${pathLength} ${pathLength}`;
  trail.style.strokeDashoffset = `${pathLength - flightStartLength}`;
  const foregroundLength = FOREGROUND_TRAIL_END - FOREGROUND_TRAIL_START;
  foregroundTrail.style.strokeDasharray = `${foregroundLength} ${pathLength - foregroundLength}`;
  foregroundTrail.style.strokeDashoffset = `${pathLength - FOREGROUND_TRAIL_START}`;
  flightStarted.value = true;
  trail.classList.add("is-visible");
  setFlightProgress(0);
  flightStartTime = performance.now();

  const tick = (now) => {
    const elapsed = Math.min(1, (now - flightStartTime) / flightDuration);
    // Ease the takeoff and landing while keeping the drawn line locked to the
    // rider's exact path distance.
    const progress = elapsed * elapsed * (3 - 2 * elapsed);
    setFlightProgress(progress);
    if (elapsed >= 1) finishFlight();
    else flightFrameId = requestAnimationFrame(tick);
  };
  flightFrameId = requestAnimationFrame(tick);
};

watch(
  [() => store.imgLoadStatus, spriteReady, spriteFailed],
  ([ready, spriteLoaded, failed]) => {
    if (!ready) return;
    if (failed) finishFlight();
    else if (spriteLoaded && !flightActive.value) {
      beginFlight();
      // If iOS suspends requestAnimationFrame mid-flight, finish cleanly so
      // the page can appear without waiting for the next animation frame.
      flightFallbackTimer = setTimeout(finishFlight, 3600);
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  clearTimeout(flightFallbackTimer);
  if (flightFrameId) cancelAnimationFrame(flightFrameId);
});
</script>

<style lang="scss" scoped>
#loader-wrapper {
  --ink: #263d59;
  --ink-soft: #36506d;

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
    opacity 0.22s ease,
    visibility 0s 0.22s;

  .loader-scene {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    background: #6d91d8;

    .loader-scene-art {
      position: absolute;
      left: 50%;
      top: 50%;
      width: max(calc(100vw + 64px), 177.7778vh);
      aspect-ratio: 16 / 9;
      transform: translate(-50%, -50%);
      scale: 1.08;
      will-change: transform, scale;
    }

    .loader-scene-image {
      display: block;
      width: 100%;
      height: 100%;
    }

    .loader-sprite-preload {
      position: absolute;
      width: 1px;
      height: 1px;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .loader-flight-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;

      .flight-trail,
      .foreground-trail {
        opacity: 0;

        path {
          fill: none;
          stroke-dasharray: inherit;
          stroke-dashoffset: inherit;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .trail-glow {
          stroke: #ffc928;
          stroke-width: 54;
          opacity: 0.28;
        }

        .trail-body {
          stroke: #ffe242;
          stroke-width: 20;
          opacity: 0.96;
        }

        .trail-core {
          stroke: #fff88a;
          stroke-width: 7;
        }
      }

      .flight-trail.is-visible {
        opacity: 1;
      }

      .foreground-trail {
        pointer-events: none;
      }

      .flight-rider,
      .settled-rider {
        transition: opacity 0.16s ease;
      }

      .flight-rider {
        opacity: 0;
        transform-box: view-box;
        transform-origin: 0 0;
      }

      &.flight-started .flight-rider {
        opacity: 1;
      }

      .settled-rider {
        opacity: 0;
      }

      &.settled {
        .flight-rider {
          opacity: 0;
        }

        .settled-rider {
          opacity: 1;
        }
      }
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
      filter: drop-shadow(0 0 10px rgba(255, 244, 199, 0.95))
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
      backdrop-filter: none;

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

  &.finished {
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
  }

  &.flying .loader {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: none;
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
  }
}

@media (prefers-reduced-motion: reduce) {
  #loader-wrapper .loader-ring {
    animation: none !important;
  }
}
</style>
