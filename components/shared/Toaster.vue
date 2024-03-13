<script lang="ts" setup>
const nuxtApp = useNuxtApp();
const bs = nuxtApp.$bootstrap;

const toastEl = ref(null);
const title = ref('');
const content = ref('');
let toast: any;

nuxtApp.$bus.$on('toast', (config: any) => {
  if (toastEl.value) {
    title.value = config.title;
    content.value = config.content;
    toast = new bs.Toast(toastEl.value, config);
    toast.show();
  }
});

function hide() {
  if (toast && toast.hide) {
    toast.hide();
  }
}
</script>

<template>
  <div
    ref="toastEl"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    class="toast"
  >
    <div class="toast-header bg-brand">
      <strong class="mr-auto">{{ title }}</strong>
      <button
        type="button"
        class="ml-2 mb-1 btn-close"
        data-dismiss="toast"
        aria-label="Close"
        @click="hide()"
      ></button>
    </div>
    <div class="toast-body">
      {{ content }}
    </div>
  </div>
</template>

<style lang="scss">
.toast {
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 252, 252, 0.96);
  z-index: 999999;
  box-shadow: 0px 0px 10px 1px rgb(0 0 0 / 42%);

  .toast-header {
    color: var(--brand-primary);
    background-color: #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.slide-in-right {
  animation: slide-in-right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes slide-in-right {
  0% {
    -webkit-transform: translateX(1000px);
    transform: translateX(1000px);
    opacity: 0;
  }

  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
