import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js';
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('bootstrap', bootstrap);
});
