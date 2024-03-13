import type { RouterConfig } from '@nuxt/schema';
// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
  routes: (_routes) => [
    {
      name: 'index',
      path: '/',
      component: () => import('~/pages/index.vue'),
    },
    {
      name: 'car-details',
      path: '/car-details/:id',
      component: () => import('~/pages/car-details/[id].vue'),
    },
    {
      name: 'car-listing',
      path: '/car-list',
      component: () => import('~/pages/car-listing.vue'),
    },
    {
      name: 'about-us',
      path: '/about-us',
      component: () => import('~/pages/about-us.vue'),
    },
    {
      name: 'our-services',
      path: '/our-services',
      component: () => import('~/pages/our-services.vue'),
    },
    {
      name: 'submit-review',
      path: '/submit-review',
      component: () => import('~/pages/submit-review.vue'),
    },
  ],
};
