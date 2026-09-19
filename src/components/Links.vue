<template>
  <div v-if="siteLinks[0]" class="links">
    <div class="line">
      <Icon size="20">
        <Link />
      </Icon>
      <span class="title">网站列表</span>
    </div>
    <Swiper
      v-if="siteLinks[0]"
      :modules="[Pagination, Mousewheel]"
      :slides-per-view="1"
      :space-between="40"
      :pagination="{
        el: '.swiper-pagination',
        clickable: true,
        bulletElement: 'div',
      }"
      :mousewheel="true"
    >
      <SwiperSlide v-for="site in siteLinksList" :key="site.map((item) => item.name).join('-')">
        <el-row class="link-all" :gutter="20">
          <el-col v-for="(item, index) in site" :key="item.name" :span="columnSpan">
            <div
              class="item cards"
              :class="{ 'reader-card': item.name === '书房' }"
              :style="index < itemsPerRow ? 'margin-bottom: 20px' : null"
              @click="jumpLink(item)"
            >
              <svg
                v-if="item.icon === 'ReaderBook'"
                class="reader-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M3.5 5.25c2.55 0 4.7.56 6.5 1.69v11.81c-1.8-1.13-3.95-1.69-6.5-1.69V5.25Zm17 0c-2.55 0-4.7.56-6.5 1.69v11.81c1.8-1.13 3.95-1.69 6.5-1.69V5.25ZM12 7.2v11.55"
                />
              </svg>
              <Icon v-else size="26">
                <component :is="siteIcon[item.icon]" />
              </Icon>
              <span class="name text-hidden">{{ item.name }}</span>
            </div>
          </el-col>
        </el-row>
      </SwiperSlide>
      <div class="swiper-pagination" />
    </Swiper>
  </div>
</template>

<script setup>
import { Icon } from "@vicons/utils";
import { Link, Blog, CompactDisc, Cloud, Compass, LaptopCode } from "@vicons/fa";
import { mainStore } from "@/store";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Mousewheel } from "swiper";
import siteLinks from "@/assets/siteLinks.json";
import "swiper/scss";
import "swiper/scss/pagination";

const store = mainStore();
const itemsPerPage = computed(() => 4);
const itemsPerRow = computed(() => 2);
const columnSpan = computed(() => 24 / itemsPerRow.value);

const siteLinksList = computed(() => {
  const result = [];
  for (let i = 0; i < siteLinks.length; i += itemsPerPage.value) {
    result.push(siteLinks.slice(i, i + itemsPerPage.value));
  }
  return result;
});

const siteIcon = {
  Blog,
  Cloud,
  CompactDisc,
  Compass,
  LaptopCode,
};

const jumpLink = (data) => {
  if (!data.link) {
    ElMessage({
      message: "即将上线",
      grouping: true,
    });
    return;
  }
  if (data.name === "音乐" && store.musicClick) {
    if (typeof $openList === "function") $openList();
  } else {
    window.open(data.link, "_blank");
  }
};
</script>

<style lang="scss" scoped>
.links {
  .line {
    margin: 2rem 0.25rem 1rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    animation: fade 0.5s;

    .title {
      margin-left: 8px;
      font-size: 1.15rem;
      text-shadow: 0 0 5px #00000050;
    }
  }

  .swiper {
    left: -10px;
    width: calc(100% + 20px);
    padding: 5px 10px 0;
    z-index: 0;

    .swiper-slide {
      height: 100%;
    }

    .swiper-pagination {
      position: static;
      margin-top: 4px;

      :deep(.swiper-pagination-bullet) {
        background-color: #fff;
        width: 18px;
        height: 4px;
        border-radius: 4px;
        transition: opacity 0.3s;

        &:hover {
          opacity: 1;
        }
      }
    }
  }

  .link-all {
    height: 220px;

    .item {
      height: 100px;
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      padding: 0 10px;
      animation: fade 0.5s;
      background: rgb(0 0 0 / 20%);

      &.reader-card {
        background: rgb(0 0 0 / 42%);
        box-shadow:
          inset 0 0 0 1px rgb(255 255 255 / 10%),
          0 8px 22px rgb(0 0 0 / 10%);

        &:hover {
          background: rgb(0 0 0 / 52%);
        }
      }

      .reader-icon {
        width: 28px;
        height: 28px;
        flex: 0 0 28px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2.15;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      &:not(.reader-card):hover {
        background: rgb(0 0 0 / 34%);
      }

      &:hover {
        transform: scale(1.02);
        transition: 0.3s;
      }

      &:active {
        transform: scale(1);
      }

      .name {
        font-size: 1.1rem;
        margin-left: 8px;
      }

      @media (min-width: 720px) and (max-width: 820px) {
        .name {
          display: none;
        }
      }

      @media (max-width: 720px) {
        height: 80px;
      }

      @media (max-width: 460px) {
        flex-direction: column;

        .name {
          font-size: 1rem;
          margin-left: 0;
          margin-top: 8px;
        }
      }
    }

    @media (max-width: 720px) {
      height: 180px;
    }
  }
}
</style>
