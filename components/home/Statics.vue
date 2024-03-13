<script setup lang="ts">
const nuxtApp = useNuxtApp();
const router = useRouter();

function showSellPopup() {
  nuxtApp.$bus.$emit('openSellPopUp');
}

function showCarList() {
  router.push({ path: '/car-list' });
}

function showOurService() {
  router.push({ path: '/our-services' });
}
</script>

<template>
  <div ref="staticBox" class="statics">
    <div class="container statics-block">
      <div class="row">
        <div class="col-lg-4 col-sm-12 col-12 statics-column-wrapper">
          <div class="statics-item">
            <div class="static-details">
              <button class="btn custom-button-stats" @click="showCarList()">
                Köp bil
              </button>
              <h3 class="static-title">Se våra lagerbilar</h3>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-sm-12 col-12 statics-column-wrapper">
          <div class="statics-item">
            <div class="static-details">
              <button class="btn custom-button-stats" @click="showSellPopup()">
                Sälj bil
              </button>
              <h3 class="static-title">Vi köper din bil</h3>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-sm-12 col-12 statics-column-wrapper">
          <div class="statics-item">
            <div class="static-details">
              <button class="btn custom-button-stats" @click="showOurService()">
                Våra tjänster
              </button>
              <h3 class="static-title">Läs mer om oss</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
