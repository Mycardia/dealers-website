import { defineStore } from 'pinia';
import type { AboutUs, OurService } from '@/models/page-data';

export const usePageDataStore = defineStore('page-data-store', () => {
  const aboutUsData: AboutUs = reactive({} as AboutUs);
  const ourServiceData: OurService = reactive({} as OurService);
  function setAboutUsData(data: AboutUs) {
    for (const key in data) {
      (aboutUsData as any)[key] = (data as any)[key];
    }
    aboutUsData.backgroundImage = {
      'background-image': `url(${data.banner_image || ''})`,
    };
  }

  function setOurServiceData(data: OurService) {
    for (const key in data) {
      (ourServiceData as any)[key] = (data as any)[key];
    }
    ourServiceData.backgroundImage = {
      'background-image': `url(${data.full_service_banner_path || ''})`,
    };
  }
  return { aboutUsData, setAboutUsData, ourServiceData, setOurServiceData };
});
