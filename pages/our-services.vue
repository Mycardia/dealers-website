<script setup lang="ts">
import svgDoubleArrowIcon from '@/assets/svg/double-arrow.svg';
import { usePageDataStore } from '@/store/page-data-store';
const { ourServiceData } = usePageDataStore();
const activeItem = ref(0);

const contentEl = ref(false);
onMounted(() => {
  contentEl.value = true;
});

function toggle(index: number) {
  if (activeItem.value === index) {
    activeItem.value = 0;
  } else {
    activeItem.value = index;
  }
}
</script>
<template>
  <HomeAppHeader></HomeAppHeader>
  <main class="grey-bg header-spacing">
    <div
      class="inner-banner our-services"
      :style="ourServiceData?.backgroundImage"
    >
      <div class="overlay">
        <div class="container">
          <div class="banner-text">
            <div class="main-caption">
              {{ ourServiceData.services_page_title }}
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
      <div v-if="contentEl" class="services-block">
        <div class="accordion">
          <div
            v-for="(block, blockIndex) in ourServiceData.cmsServices"
            :key="blockIndex"
            :class="{ active: block.id === activeItem }"
            class="accordion-item"
            @click="toggle(block.id)"
          >
            <h2 class="accordion-header">
              <button
                :class="{ collapsed: block.id === activeItem }"
                class="accordion-button"
              >
                {{ block.content_title }}
              </button>
            </h2>
            <div
              :class="{ show: block.id === activeItem }"
              class="accordion-collapse collapse"
            >
              <div class="accordion-body" v-html="block.descriptionHtml"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <HomeAppFooter></HomeAppFooter>
</template>
<script lang="ts" setup></script>
<style></style>
