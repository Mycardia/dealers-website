// import 'vue3-carousel/dist/carousel.css'
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel';
import VueMultiselect from 'vue-multiselect';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Carousel', Carousel);
  nuxtApp.vueApp.component('Slide', Slide);
  nuxtApp.vueApp.component('Pagination', Pagination);
  nuxtApp.vueApp.component('Navigation', Navigation);
  nuxtApp.vueApp.component('vSelect', VueMultiselect);
});
