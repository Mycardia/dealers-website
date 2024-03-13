import { defineStore } from 'pinia';
import type { HomePageCMS } from '@/models/cms';

export const useCMSStore = defineStore('cms-store', () => {
  const homePageData: HomePageCMS = reactive({} as HomePageCMS);
  function setHomePageData(data: HomePageCMS) {
    for (const key in data) {
      (homePageData as any)[key] = (data as any)[key];
    }
    homePageData.backgroundImage = {
      'background-image': `url(${data.full_banner_path || ''})`,
    };
    homePageData.emailUrl = `mailto:${data.email || ''}`;
    homePageData.phoneUrl = `tel:${data.phone || ''}`;
  }
  return { homePageData, setHomePageData };
});
