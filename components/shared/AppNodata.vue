<script setup lang="ts">
import svgNoData from '@/assets/svg/common/no-data.svg';
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <div class="no-data">
    <svgNoData class="no-data-image"></svgNoData>
    <h5 class="no-data-text">
      {{ props.text }}
    </h5>
  </div>
</template>
<style scoped lang="scss">
.no-data {
  display: block;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: var(--bs-gray-100);
  margin: 20px;
  width: 100%;
  height: 280px;

  .no-data-text {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    color: var(--bs-gray-600);
    font-style: italic;
    margin-left: 20px;
  }

  .no-data-image {
    &::v-deep(.brand-bg) {
      fill: var(--brand-primary);
    }
  }
}
</style>
