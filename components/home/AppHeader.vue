<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core';
import svgEmailIcon from '@/assets/svg/email.svg';
import svgPhoneIcon from '@/assets/svg/phone.svg';
import { useCMSStore } from '@/store/cms-store';
import type { HomePageCMS } from '@/models/cms';

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

const nuxtApp = useNuxtApp();
const { homePageData: cms, setHomePageData } = useCMSStore();
const config = useRuntimeConfig();
const header = ref(null);
let resizeObserver: ResizeObserver | null = null;
let marginEl: HTMLElement | null = null;

function showSellPopup() {
  nuxtApp.$bus.$emit('openSellPopUp');
}

async function fetchPageData() {
  let response: any = null;
  try {
    const asyncData = await useFetch(
      `${config.public.API_BASE_URL}/dealership/${useShopId().value}/cms`
    );
    response = asyncData.data?._rawValue;
  } catch (e) {
    console.error(e);
    response = null;
  }
  if (response && response.code === 200) {
    const outPut = processData(response.result);
    updatePageProperties(outPut);
    setHomePageData(outPut);
  }
}

function processData(result: Partial<HomePageCMS>): HomePageCMS {
  result.rate_of_interest = parseFloat(result.rate_of_interest + '') || 0;
  return result as HomePageCMS;
}

function updatePageProperties(data: HomePageCMS) {
  const url = data.full_favicon_path || '/favicon.ico';
  const ext = url.split('.').pop();
  let format = 'image/png'; // Default

  if (ext === 'ico') {
    format = 'image/x-icon';
  }

  const brandStyle = [];
  if (data?.themes?.brand_color) {
    const hoverBG = shadeColor(data?.themes?.brand_color, -14);
    const hoverBorder = shadeColor(data?.themes?.brand_color, -19);
    const activeBorder = shadeColor(data?.themes?.brand_color, -25);

    brandStyle.push(`:root{
      --brand-primary: ${data?.themes.brand_color} !important;
      --brand-primary-hover-bg: ${hoverBG} !important;
      --brand-primary-active-bg: ${hoverBorder} !important;
      --brand-primary-hover-border: ${hoverBorder} !important;
      --brand-primary-active-border: ${activeBorder} !important;

      --theme-navbar-bg-color: ${data?.themes.navbar_bg_color} !important;
      --theme-navbar-text-color: ${data?.themes.navbar_text_color} !important;
      --theme-latest-cars-section-bg-color: ${data?.themes.latest_cars_section_bg_color} !important;
      --theme-latest-cars-section-text-color: ${data?.themes.latest_cars_section_text_color} !important;
      --theme-happy-customer-section-bg-color: ${data?.themes.happy_customer_section_bg_color} !important;
      --theme-happy-customer-section-text-color: ${data?.themes.happy_customer_section_text_color} !important;
      --theme-our-advantages-section-bg-color: ${data?.themes.our_advantages_section_bg_color} !important;
      --theme-our-advantages-section-text-color: ${data?.themes.our_advantages_section_text_color} !important;
      --theme-our-services-section-bg-color: ${data?.themes.our_services_section_bg_color} !important;

    }`);
  }

  useHead({
    title: data.dealer,
    link: [{ rel: 'icon', type: format, href: url }],
    meta: [
      { name: 'title', content: data?.meta_title || '' },
      { name: 'description', content: data?.meta_description || '' },
      { name: 'og:title', content: data?.meta_title || '' },
      { name: 'og:site_name', content: data.dealer || '' },
      { name: 'og:description', content: data?.meta_description || '' },
      { name: 'og:type', content: 'product.car' },
      { name: 'og:image', content: data.full_logo_path },
    ],
    style: brandStyle,
  });
}

const RzObs = useResizeObs();
if (RzObs) {
  resizeObserver = new RzObs((entries) => {
    if (!marginEl) {
      marginEl = document.querySelector('.header-spacing') as HTMLElement;
    }
    for (const entry of entries) {
      if ((entry.target as HTMLElement) === header?.value) {
        marginEl.style.marginTop = `${entry.contentRect.height}px`;
      }
    }
  });
}

onMounted(() => {
  const headerEl = (header as any)?.value as HTMLElement;
  if (resizeObserver && headerEl) {
    resizeObserver.observe(headerEl);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

function shadeColor(color: string, percent: number) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.floor((R * (100 + percent)) / 100);
  G = Math.floor((G * (100 + percent)) / 100);
  B = Math.floor((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  const RR =
    R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16);
  const GG =
    G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16);
  const BB =
    B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16);

  return '#' + RR + GG + BB;
}

fetchPageData();
</script>

<template>
  <header ref="header" class="app-header-el">
    <div class="info-strip">
      <div class="container">
        <div class="info-block fw-medium">
          <a :href="cms.emailUrl" class="contact-item">
            <span class="icon">
              <svgEmailIcon></svgEmailIcon>
            </span>
            <span> {{ $t('E-mail') }}: {{ cms?.email }}</span>
          </a>
          <a :href="cms.phoneUrl" class="contact-item">
            <span class="icon">
              <svgPhoneIcon></svgPhoneIcon>
            </span>
            <span>{{ $t('Call Us Now') }}: {{ cms?.phone }}</span>
          </a>
        </div>
      </div>
    </div>
    <DefineTemplate>
      <NuxtLink class="navbar-brand" href="/">
        <img :src="cms?.full_logo_path" alt="Dealer logo" />
      </NuxtLink>
    </DefineTemplate>
    <nav class="nav-strip navbar navbar-expand-lg">
      <div class="container">
        <ReuseTemplate></ReuseTemplate>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#navbarToggler"
          aria-controls="navbarToggler"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          id="navbarToggler"
          class="offcanvas-lg offcanvas-start"
          tabindex="-1"
        >
          <div class="offcanvas-header">
            <ReuseTemplate></ReuseTemplate>
            <button
              type="button"
              class="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              data-bs-target="#navbarToggler"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav ms-auto mt-2 mt-lg-0">
              <li class="nav-item">
                <NuxtLink class="nav-link" href="/">
                  {{ $t('Home') }}
                </NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink class="nav-link" href="/car-list">
                  {{ $t('Buy car') }}
                </NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink class="nav-link" href="/our-services">
                  {{ $t('Our Services') }}
                </NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink class="nav-link" href="/about-us">
                  {{ $t('About us') }}
                </NuxtLink>
              </li>
            </ul>
            <div class="head-button flex-center" @click="showSellPopup()">
              <button class="btn btn-brand">
                {{ $t('Sell your car') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style></style>
