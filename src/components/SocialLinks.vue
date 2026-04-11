<template>
  <!-- 社交链接 -->
  <div class="social">
    <div class="link">
      <a
        v-for="item in socialLinks"
        :key="item.name"
        :href="item.url"
        target="_blank"
        @mouseenter="socialTip = item.tip"
        @mouseleave="socialTip = '通过这里联系我吧'"
      >
        <img class="icon" :src="item.icon" height="24" />
      </a>
    </div>
    <span class="tip">{{ socialTip }}</span>
  </div>
</template>

<script setup>
import socialLinks from "@/assets/socialLinks.json";

// 社交链接提示
const socialTip = ref("通过这里联系我吧");
</script>

<style lang="scss" scoped>
.social {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  gap: 0.5rem;
  background-color: transparent;
  border-radius: 6px;
  backdrop-filter: none;
  animation: fade 0.5s;
  @media (max-width: 840px) {
    justify-content: center;
    .link {
      justify-content: space-evenly !important;
      width: 90%;
    }
    .tip {
      display: none !important;
    }
  }

  .link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 32px;
    a {
      display: inherit;
      .icon {
        margin: 0 12px;
        transition: transform 0.3s;
        &:hover {
          transform: scale(1.1);
        }
        &:active {
          transform: scale(1);
        }
      }
    }
  }
  .tip {
    display: none;
    animation: fade 0.5s;
  }
  @media (min-width: 768px) {
    &:hover {
      background-color: transparent;
      backdrop-filter: none;
      .tip {
        display: block;
      }
    }
  }
}
</style>
