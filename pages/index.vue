<script lang="ts" setup>
const carCount = ref(0);
</script>

<template>
  <HomeAppHeader></HomeAppHeader>
  <main class="header-spacing">
    <HomeLanding></HomeLanding>
    <HomeCardList @count="carCount = $event"></HomeCardList>
    <HomeCustomerReview
      :additional-top-margin="carCount === 0"
    ></HomeCustomerReview>
    <HomeAdvantages></HomeAdvantages>
    <HomeStatics></HomeStatics>
    <HomeServices></HomeServices>
    <HomeBrandList></HomeBrandList>
  </main>
  <HomeAppFooter></HomeAppFooter>
</template>

<style></style>
