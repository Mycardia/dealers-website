<script setup lang="ts">
import svgServiceIconCash from '@/assets/svg/service-icon-cash.svg';
import svgServiceIconBank from '@/assets/svg/service-icon-bank.svg';
import svgServiceIconPick from '@/assets/svg/service-icon-pick.svg';
import svgServiceIconMail from '@/assets/svg/service-icon-mail.svg';
</script>

<template>
  <div class="our-advantages services height-fix">
    <div class="container advantages-block">
      <div class="row">
        <div class="col-lg-3 col-sm-6 col-xs-12">
          <div class="advantages-item">
            <div class="image-holder">
              <svgServiceIconCash></svgServiceIconCash>
            </div>
            <div class="advantages-details">
              <h2 class="advantages-heading fw-extra-bold">Vi köper din bil</h2>
              <p class="advantages-description">
                Vi köper bilar som har kört upp till 20 000 mil och är yngre än
                20 år
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-sm-6 col-xs-12">
          <div class="advantages-item">
            <div class="image-holder">
              <svgServiceIconBank></svgServiceIconBank>
            </div>
            <div class="advantages-details">
              <h2 class="advantages-heading fw-extra-bold">
                Pengarna på kontot direkt
              </h2>
              <p class="advantages-description">
                Vi arbetar med Swish och digitala överföringar. Du har alltid
                pengarna på kontot innan du lämnar över bilen till oss.
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-sm-6 col-xs-12">
          <div class="advantages-item">
            <div class="image-holder">
              <svgServiceIconPick></svgServiceIconPick>
            </div>
            <div class="advantages-details">
              <h2 class="advantages-heading fw-extra-bold">
                Vi erbjuder upphämtning
              </h2>
              <p class="advantages-description">
                Vi erbjuder upphämtning i hela landet för en smidigare affär.
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-sm-6 col-xs-12">
          <div class="advantages-item">
            <div class="image-holder">
              <svgServiceIconMail></svgServiceIconMail>
            </div>
            <div class="advantages-details">
              <h2 class="advantages-heading fw-extra-bold">
                Bud via telefon eller mail
              </h2>
              <p class="advantages-description">
                Ange bilens registreringsnummer, miltal och dina
                kontaktuppgifter i formuläret så återkommer vi inom kort med ett
                bud.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.height-fix {
  min-height: 400px !important;
}
</style>
