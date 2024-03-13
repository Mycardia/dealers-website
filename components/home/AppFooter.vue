<script setup lang="ts">
import _ from 'lodash';
import { useCMSStore } from '@/store/cms-store';
import { AboutUs, OurService } from '@/models/page-data';
import { usePageDataStore } from '@/store/page-data-store';
const { homePageData: cms } = useCMSStore();
const { aboutUsData, setAboutUsData, setOurServiceData } = usePageDataStore();

const config = useRuntimeConfig();

async function fetchOurServicesData() {
  let response: any = null;
  try {
    const asyncData = await useFetch(
      `${config.public.API_BASE_URL}/dealership/${
        useShopId().value
      }/our-services`
    );
    response = asyncData.data?._rawValue;
  } catch (e) {
    console.error(e);
    response = null;
  }
  if (response && response.code === 200) {
    const outPut = processOurServicesData(response.result);
    setOurServiceData(outPut);
  }
}

async function fetchAboutUsData() {
  let response: any = null;
  try {
    const asyncData = await useFetch(
      `${config.public.API_BASE_URL}/dealership/${useShopId().value}/about-us`
    );
    response = asyncData.data?._rawValue;
  } catch (e) {
    console.error(e);
    response = null;
  }
  if (response && response.code === 200) {
    const outPut = processAboutUsData(response.result);
    setAboutUsData(outPut);
  }
}

function processOurServicesData(result: Partial<OurService>): OurService {
  result.services_banner_image = result.services_banner_image || '';
  result.services_page_title = result.services_page_title || '';
  (result?.cmsServices || []).forEach((item) => {
    item.content_title = item.content_title || '';
    item.menu_title = item.content_title;
    item.description = item.description || '';
    const contentArray: string[] = [];
    ((item.description || '').split('\n') || []).forEach((lineData) => {
      const line = lineData.trim();
      if (line) {
        contentArray.push(`<p>${_.escape(line)}</p>`);
      }
    });
    item.descriptionHtml = contentArray.join('');
  });
  return result as OurService;
}

function processAboutUsData(result: Partial<AboutUs>): AboutUs {
  result.banner_image = result.banner_image || '';
  result.content = result.content || '';
  result.title = result.title || '';
  result.subtitle = result.subtitle || '';
  const contentArray: string[] = [];
  (result.content.split('\n') || []).forEach((lineData) => {
    const line = lineData.trim();
    if (line) {
      contentArray.push(`<p>${_.escape(line)}</p>`);
    }
  });
  result.contentHtml = contentArray.join('');
  return result as AboutUs;
}

fetchAboutUsData();
fetchOurServicesData();
</script>

<template>
  <footer>
    <div class="container">
      <div class="row">
        <div class="col-6 footer-item">
          <div>
            <span>{{ cms?.address }} </span> |
            <a class="footer-contact-link" :href="cms?.emailUrl">
              {{ cms?.email }}</a
            >
            |
            <a class="footer-contact-link" :href="cms?.phoneUrl">
              {{ cms?.phone }}</a
            >
          </div>
        </div>
        <div class="col-6 footer-item flex-end">
          <div class="footer-right">
            <a
              v-if="aboutUsData.ln_link"
              class="footer-link"
              :href="aboutUsData.ln_link"
              target="_blank"
              >LinkedIn</a
            >
            <a
              v-if="aboutUsData.insta_link"
              class="footer-link"
              :href="aboutUsData.insta_link"
              target="_blank"
              >Instagram</a
            >
            <a
              v-if="aboutUsData.fb_link"
              class="footer-link"
              :href="aboutUsData.fb_link"
              target="_blank"
              >Facebook</a
            >
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
a.footer-contact-link {
  cursor: pointer;
  color: #ffffff;
}

.footer-link:not(:last-child):after {
  content: '|';
  margin-left: 8px;
  color: #ffffff;
  pointer-events: none;
}
</style>
