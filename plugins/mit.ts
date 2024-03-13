import mitt from 'mitt';

export default defineNuxtPlugin((nuxtApp) => {
  const emitter = mitt();
  nuxtApp.provide('bus', {
    $on: emitter.on,
    $emit: emitter.emit,
  });
});
