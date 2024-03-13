import { defineStore } from 'pinia';

export const useFilterStore = defineStore('filter-list', () => {
  const config = useRuntimeConfig();
  const brandList: string[] = reactive([]);
  const modelList: string[] = reactive([]);
  const chassisList: string[] = reactive([]);
  const yearList: number[] = reactive([]);
  const milageList: number[] = reactive([]);

  const brandListFetchLoader: Ref<boolean> = ref(false);
  const modelListFetchLoader: Ref<boolean> = ref(false);
  const chassisListFetchLoader: Ref<boolean> = ref(false);

  function initData() {
    fetchList(
      `
    ${config.public.API_BASE_URL}/dealership/${useShopId().value}/car/brands`,
      brandList,
      brandListFetchLoader,
      'brands'
    );

    fetchList(
      `
    ${config.public.API_BASE_URL}/dealership/${useShopId().value}/car/chassis`,
      chassisList,
      chassisListFetchLoader,
      'chassis'
    );

    yearList.splice(0);
    const currentYear = new Date().getFullYear();
    const endYear = currentYear - 100;
    for (let year = currentYear; year >= endYear; year--) {
      yearList.push(year);
    }

    milageList.splice(0);
    for (let milage = 0; milage <= 40000; milage += 1000) {
      milageList.push(milage);
    }
  }

  function fetchModel(carName: string) {
    fetchList(
      `
    ${config.public.API_BASE_URL}/dealership/${
        useShopId().value
      }/car/models/${encodeURIComponent(carName)}`,
      modelList,
      modelListFetchLoader,
      'models'
    );
  }

  async function fetchList(
    url: string,
    target: string[],
    loader: Ref<boolean>,
    key: string
  ) {
    loader.value = true;
    let response: any = null;
    try {
      const asyncData = await useFetch(url);
      response = asyncData.data._rawValue;
    } catch (e) {
      console.error(e);
      response = null;
    }

    if (response && response.code === 200) {
      target.splice(0);
      const objectClone = Object.assign({}, response.result || {});
      const arrayData = Object.values(objectClone[key]) as string[];
      [...arrayData].forEach((item) => {
        target.push(item);
      });
    }
    loader.value = false;
  }

  initData();

  return {
    brandList,
    modelList,
    chassisList,
    brandListFetchLoader,
    modelListFetchLoader,
    chassisListFetchLoader,
    fetchModel,
    yearList,
    milageList,
  };
});
