<script setup lang="ts">
import svgDoubleArrowIcon from '@/assets/svg/double-arrow.svg';
import { usePageDataStore } from '@/store/page-data-store';
const { aboutUsData } = usePageDataStore();
const contentEl = ref(false);
onMounted(() => {
  contentEl.value = true;
});

function renderHtml() {
  return aboutUsData?.contentHtml || aboutUsData?.content || '';
}
</script>
<template>
  <HomeAppHeader></HomeAppHeader>
  <main class="grey-bg header-spacing">
    <div class="inner-banner" :style="aboutUsData?.backgroundImage">
      <div class="overlay">
        <div class="container">
          <div class="banner-text">
            <div class="main-caption">
              {{ aboutUsData?.title }}
            </div>
            <div class="tag-line-art">
              <svgDoubleArrowIcon></svgDoubleArrowIcon>
              <svgDoubleArrowIcon></svgDoubleArrowIcon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="about-blocks">
        <div class="card single-custom-card">
          <h3 class="card-title">
            {{ aboutUsData?.subtitle }}
          </h3>
          <div v-if="contentEl" v-html="renderHtml()"></div>
        </div>
      </div>
    </div>
  </main>
  <HomeAppFooter></HomeAppFooter>
</template>
<script lang="ts" setup></script>
<style></style>
