<script setup lang="ts">
import svgAdvEasy from '@/assets/svg/adv-easy.svg';
import svgAdvFast from '@/assets/svg/adv-fast.svg';
import svgAdvSecure from '@/assets/svg/adv-secure.svg';
import svgAdvSupport from '@/assets/svg/adv-support.svg';
import { useCMSStore } from '@/store/cms-store';

const { homePageData: cms } = useCMSStore();
</script>

<template>
  <div class="our-advantages advantages-theme">
    <h1 class="heading-main">
      {{ $t('Our Advantages') }}
    </h1>
    <div class="container advantages-block">
      <div class="row">
        <div class="col-lg-3 col-sm-6 col-xs-12">
          <div class="advantages-item">
            <div class="image-holder">
              <svgAdvFast></svgAdvFast>
            </div>
            <div class="advantages-details">
              <h2 class="advantages-heading fw-extra-bold">
                {{ cms?.textBlocks?.[0]?.title }}
              </h2>
              <p class="advantages-description">
                {{ cms?.textBlocks?.[0]?.description }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-sm-6 col-xs-12">
          <div class="advantages-item">
            <div class="image-holder">
              <svgAdvEasy></svgAdvEasy>
            </div>
            <div class="advantages-details">
              <h2 class="advantages-heading fw-extra-bold">
                {{ cms?.textBlocks?.[1]?.title }}
              </h2>
              <p class="advantages-description">
                {{ cms?.textBlocks?.[1]?.description }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-sm-6 col-xs-12">
          <div class="advantages-item">
            <div class="image-holder">
              <svgAdvSecure></svgAdvSecure>
            </div>
            <div class="advantages-details">
              <h2 class="advantages-heading fw-extra-bold">
                {{ cms?.textBlocks?.[2]?.title }}
              </h2>
              <p class="advantages-description">
                {{ cms?.textBlocks?.[2]?.description }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-sm-6 col-xs-12">
          <div class="advantages-item">
            <div class="image-holder">
              <svgAdvSupport></svgAdvSupport>
            </div>
            <div class="advantages-details">
              <h2 class="advantages-heading fw-extra-bold">
                {{ cms?.textBlocks?.[3]?.title }}
              </h2>
              <p class="advantages-description">
                {{ cms?.textBlocks?.[3]?.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
