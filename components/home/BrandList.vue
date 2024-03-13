<script setup lang="ts">
import { useCMSStore } from '@/store/cms-store';
import '@/node_modules/vue3-carousel/dist/carousel.css';
import type { PartnerLogo } from '@/models/cms';
const { homePageData: cms } = useCMSStore();
const element = ref(null);

const imageArray = computed(() => {
  let arr: PartnerLogo[] = [];
  for (let i = 0; i < 4; i++) {
    arr = arr.concat(...(cms.partnerLogos || []));
  }

  return arr;
});

function duration() {
  const coff = Math.max((cms.partnerLogos || []).length, 6);
  return `${coff * 4 || 40}s`;
}
</script>

<template>
  <div
    v-if="cms?.partnerLogos?.length"
    class="car-brand-wrapper container-fluid"
  >
    <div class="brand-slider-container">
      <div
        ref="element"
        class="brand-slider-wrapper"
        :style="{ 'animation-duration': duration() }"
      >
        <div
          v-for="logo in imageArray"
          :key="logo.id"
          class="brand-slider-item"
        >
          <div class="car-brand-icon">
            <img draggable="false" :src="logo.full_partner_logo_path" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.brand-slider-container {
  overflow: hidden;
}

.brand-slider-wrapper {
  animation: scroll 40s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
  width: max-content;
}

.brand-slider-item {
  margin: 0;
}

.car-brand-icon {
  height: 200px;
  align-items: center;
  width: auto;
  display: flex;
  justify-content: center;
  padding-left: 30px;
  padding-right: 30px;
  img {
    max-height: 200px;
    max-width: 300px;
    min-height: 40px;
    min-width: 40px;
  }
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}
</style>
