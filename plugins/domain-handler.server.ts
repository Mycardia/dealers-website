export default defineNuxtPlugin((nuxtApp) => {
  const shopId = useShopId();
  const appDomain = useAppDomain();
  shopId.value = nuxtApp.ssrContext?.event.context.appIdentity.id;
  appDomain.value = nuxtApp.ssrContext?.event.context.appIdentity.domain;
});
