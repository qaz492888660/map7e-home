<template>
  <aplayer
    v-if="playList[0]"
    ref="player"
    showLrc
    :music="playList[playIndex]"
    :list="playList"
    :autoplay="autoplay"
    :theme="theme"
    :repeat="repeat"
    :shuffle="shuffle"
    :listMaxHeight="listMaxHeight"
    :listFolded="listFolded"
    :volume="volume"
    @play="onPlay"
    @pause="onPause"
    @timeupdate="onTimeUp"
    @onSelectSong="onSelectSong"
    @error="loadMusicError"
  />
</template>

<script setup>
import { MusicOne, PlayWrong } from "@icon-park/vue-next";
import { getPlayerList } from "@/api";
import { mainStore } from "@/store";
import aplayer from "vue3-aplayer";

const store = mainStore();
const player = ref(null);
const playList = ref([]);
const playIndex = ref(0);
const playListCount = ref(0);
const skipTimeout = ref(null);
const autoplayArmed = ref(false);

let wasPlaying = false;
let fadeTimer = null;
let restoreVolume = 0;

const props = defineProps({
  autoplay: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    default: "#efefef",
  },
  repeat: {
    type: String,
    default: "list",
  },
  shuffle: {
    type: Boolean,
    default: false,
  },
  volume: {
    type: Number,
    default: 0.7,
    validator: (value) => value >= 0 && value <= 1,
  },
  songServer: {
    type: String,
    default: "netease",
  },
  songType: {
    type: String,
    default: "playlist",
  },
  songId: {
    type: String,
    default: "7452421335",
  },
  listFolded: {
    type: Boolean,
    default: false,
  },
  listMaxHeight: {
    type: String,
    default: "420px",
  },
});

const getAudioEl = () => document.querySelector("audio") || player.value?.audio;

const stopFade = () => {
  if (fadeTimer) {
    clearInterval(fadeTimer);
    fadeTimer = null;
  }
};

// fadeOut: 页面隐藏时音量渐弱到 0 后暂停
const fadeOut = (audio) => {
  if (!audio) {
    return;
  }

  stopFade();
  restoreVolume = Number.isFinite(audio.volume) ? audio.volume : props.volume;
  audio.volume = restoreVolume;

  fadeTimer = setInterval(() => {
    const nextVolume = Math.max(0, Number((audio.volume - 0.05).toFixed(4)));
    audio.volume = nextVolume;

    if (nextVolume <= 0) {
      stopFade();
      audio.pause();
      audio.volume = 0;
    }
  }, 30);
};

// fadeIn: 页面恢复时从 0 渐入到之前的音量
const fadeIn = (audio) => {
  if (!audio) {
    return;
  }

  stopFade();
  const targetVolume = Math.min(1, Math.max(0, restoreVolume || props.volume || 0));
  audio.volume = 0;

  fadeTimer = setInterval(() => {
    const nextVolume = Math.min(targetVolume, Number((audio.volume + 0.05).toFixed(4)));
    audio.volume = nextVolume;

    if (nextVolume >= targetVolume) {
      stopFade();
      audio.volume = targetVolume;
    }
  }, 30);
};

const handleVisibilityChange = async () => {
  const audioEl = getAudioEl();
  if (!audioEl) {
    return;
  }

  stopFade();

  if (document.hidden) {
    wasPlaying = !audioEl.paused;
    if (wasPlaying) {
      fadeOut(audioEl);
    } else {
      restoreVolume = Number.isFinite(audioEl.volume) ? audioEl.volume : props.volume;
    }
    return;
  }

  if (wasPlaying) {
    try {
      await player.value?.play?.();
      fadeIn(audioEl);
    } catch (error) {
      console.warn("resume playback failed", error);
    }
  }

  wasPlaying = false;
};

const removeAutoplayListeners = () => {
  window.removeEventListener("pointerdown", resumeAutoplay);
  window.removeEventListener("keydown", resumeAutoplay);
  window.removeEventListener("touchstart", resumeAutoplay);
};

const resumeAutoplay = async () => {
  if (!autoplayArmed.value || !player.value || !playList.value.length) {
    return;
  }
  try {
    await player.value.play();
    autoplayArmed.value = false;
    removeAutoplayListeners();
  } catch (error) {
    console.warn("autoplay blocked, waiting for user gesture", error);
  }
};

const armAutoplay = () => {
  if (!props.autoplay || !playList.value.length) {
    return;
  }

  autoplayArmed.value = true;
  nextTick(() => {
    resumeAutoplay();
  });
  window.addEventListener("pointerdown", resumeAutoplay, { passive: true });
  window.addEventListener("keydown", resumeAutoplay);
  window.addEventListener("touchstart", resumeAutoplay, { passive: true });
};

onMounted(() => {
  nextTick(() => {
    try {
      getPlayerList(props.songServer, props.songType, props.songId).then((res) => {
        playIndex.value = Math.floor(Math.random() * res.length);
        playListCount.value = res.length;
        store.musicIsOk = true;
        playList.value = res.map((item) => ({
          title: item.name || item.title,
          artist: item.artist || item.author,
          src: item.url || item.src,
          pic: item.pic,
          lrc: item.lrc,
        }));
        armAutoplay();
      });
    } catch (error) {
      console.error(error);
      store.musicIsOk = false;
      ElMessage({
        message: "播放器加载失败",
        grouping: true,
        icon: h(PlayWrong, {
          theme: "filled",
          fill: "#efefef",
        }),
      });
    }
  });

  document.addEventListener("visibilitychange", handleVisibilityChange);
});

const onPlay = () => {
  store.setPlayerState(player.value.audio.paused);
  store.setPlayerData(player.value.currentMusic.title, player.value.currentMusic.artist);
  ElMessage({
    message: `${store.getPlayerData.name} - ${store.getPlayerData.artist}`,
    grouping: true,
    icon: h(MusicOne, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
};

const onPause = () => {
  store.setPlayerState(player.value.audio.paused);
};

const onTimeUp = () => {
  const playerRef = player.value?.$?.vnode?.el;
  if (!playerRef) {
    return;
  }
  const currentLrcElement = playerRef.querySelector(".aplayer-lrc-current");
  const previousLrcElement = currentLrcElement?.previousElementSibling;
  const lrcContent = currentLrcElement?.innerHTML || previousLrcElement?.innerHTML || "这句没有歌词";
  store.setPlayerLrc(lrcContent);
};

const playToggle = () => {
  player.value.toggle();
};

const changeVolume = (value) => {
  player.value.audio.volume = value;
};

const onSelectSong = (value) => {
  console.log(value);
};

const changeSong = (type) => {
  playIndex.value = player.value.playIndex;
  playIndex.value += type ? 1 : -1;

  if (playIndex.value < 0) {
    playIndex.value = playListCount.value - 1;
  } else if (playIndex.value >= playListCount.value) {
    playIndex.value = 0;
  }

  nextTick(() => {
    player.value.play();
  });
};

const loadMusicError = () => {
  let notice = "";
  if (playList.value.length > 1) {
    notice = "播放歌曲出现错误，播放器将于 2 秒后切换下一首";
    skipTimeout.value = setTimeout(() => {
      changeSong(1);
      if (!player.value.audio.paused) {
        onPlay();
      }
    }, 2000);
  } else {
    notice = "播放歌曲出现错误";
  }
  ElMessage({
    message: notice,
    grouping: true,
    icon: h(PlayWrong, {
      theme: "filled",
      fill: "#EFEFEF",
      duration: 2000,
    }),
  });
  console.error(`播放歌曲: ${player.value.currentMusic.title} 出现错误`);
};

defineExpose({ playToggle, changeVolume, changeSong });

onBeforeUnmount(() => {
  clearTimeout(skipTimeout.value);
  removeAutoplayListeners();
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  stopFade();
});
</script>

<style lang="scss" scoped>
.aplayer {
  width: 80%;
  background: transparent;
  border-radius: 6px;
  font-family: "HarmonyOS_Regular", sans-serif !important;
  :deep(.aplayer-body) {
    .aplayer-pic {
      display: none;
    }
    .aplayer-info {
      margin-left: 0;
      background-color: #ffffff40;
      border-color: transparent !important;
      .aplayer-music {
        flex-grow: initial;
        margin-bottom: 2px;
        overflow: initial;
        .aplayer-title {
          font-size: 16px;
          margin-right: 6px;
        }
        .aplayer-author {
          color: #efefef;
        }
      }
      .aplayer-lrc {
        text-align: left;
        margin: 4px 0 6px 6px;
        height: 100%;
        mask: linear-gradient(
          #fff 15%,
          #fff 85%,
          hsla(0deg, 0%, 100%, 0.6) 90%,
          hsla(0deg, 0%, 100%, 0)
        );
        -webkit-mask: linear-gradient(
          #fff 15%,
          #fff 85%,
          hsla(0deg, 0%, 100%, 0.6) 90%,
          hsla(0deg, 0%, 100%, 0)
        );
        &::before,
        &::after {
          display: none;
        }
        p {
          color: #efefef;
        }
        .aplayer-lrc-current {
          font-size: 0.95rem;
          margin-bottom: 4px !important;
        }
      }
      .aplayer-controller {
        display: none;
      }
    }
  }
  :deep(.aplayer-list) {
    margin-top: 6px;
    ol {
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
      li {
        border-color: transparent;
        &.aplayer-list-light {
          background: #ffffff40;
          border-radius: 6px;
        }
        &:hover {
          background: #ffffff26 !important;
          border-radius: 6px !important;
        }
        .aplayer-list-index,
        .aplayer-list-author {
          color: #efefef;
        }
      }
    }
  }
}
</style>
