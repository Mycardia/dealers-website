<script lang="ts" setup>
import '@/node_modules/vue3-carousel/dist/carousel.css';
import svgSliderNext from '@/assets/svg/details-page/slider-next.svg';
import svgSliderPrev from '@/assets/svg/details-page/slider-prev.svg';
import svgCamera from '@/assets/svg/details-page/camera.svg';
import svgFullScreen from '@/assets/svg/details-page/full-screen.svg';
import svgFullScreenExit from '@/assets/svg/details-page/full-screen-exit.svg';
import svgCall from '@/assets/svg/details-page/call.svg';
import svgExpandCircle from '@/assets/svg/details-page/expand-circle.svg';
import { CarDetails, EnquiryType, StockFile } from '@/models/car-details';
import { useCMSStore } from '@/store/cms-store';

const { homePageData: cms } = useCMSStore();

const IDEAL_IMAGE_WIDTH = 1200;
const IDEAL_IMAGE_HEIGHT = 675;

const route = useRoute();
const nuxtApp = useNuxtApp();

const carId = route.params.id;

const config = useRuntimeConfig();
const loader = ref(false);
const sliderElement = ref(null);
const currentSlide = ref(0);

const slideView = ref(null);
const thumbView = ref(null);

const finCalculator = reactive({
  downPaymentPercentage: 50,
  downPaymentAmount: 0,
  loanTenure: 3,
  loanTenureMax: 5,

  totalMonth: 0,
  principleOfLoan: 0,
  InterestOfLoan: 0,
  totalPayableLoan: 0,
  totalEmiAmount: 0,
  monthlyEmiAmount: 0,

  displayMonthlyEmiAmount: '',
  displayTotalEmiAmount: '',
  displayPrincipleOfLoan: '',

  residualCashPercentage: 30,
  residualCashAmount: 0,
  effectiveInterest: 0,

  displayDiffPrice: '', // sale_price- downPaymentAmount
  displayDownPaymentAmount: '',
  displayResidualCashAmount: '',

  show: true,
});

const pageData = reactive<CarDetails>({} as CarDetails);

const totalItem = ref(5);
const snapAlign = computed(() => {
  return pageData?.stock_files?.length < totalItem.value
    ? 'start'
    : 'center-odd';
});

const noDataFound = computed(
  () => !pageData || Object.keys(pageData).length === 0
);
async function fetchPageData() {
  loader.value = true;
  let response: any = null;
  try {
    const asyncData = await useFetch(
      `${config.public.API_BASE_URL}/dealership/${
        useShopId().value
      }/cars/${carId}`
    );
    response = asyncData.data?._rawValue;
  } catch (e) {
    console.error(e);
    response = null;
  }
  if (response && response.code === 200) {
    processData(response.result);
    updatePageMeta();
    initCalculatorFields();
  }

  loader.value = false;
}

function showInterestPopup(enqType: EnquiryType) {
  nuxtApp.$bus.$emit('openTalkToSalePersonPopup', {
    carInfo: { ...pageData },
    queryType: enqType,
    carId,
  });
}

function processData(rawPageDetails: Partial<CarDetails>) {
  for (const key in rawPageDetails) {
    pageData[key] = rawPageDetails[key];
  }

  pageData.description = pageData.carData.car_name.replace(
    pageData.carData.brand,
    ''
  );
  const stockFiles = [
    {
      path: '/shared/fallback-hd.png',
      thumb: '/shared/fallback.png',
      name: 'Thumb',
      imageLoaded: false,
      ratioMatch: false,
    },
  ];
  pageData.utrustningList = prepareUtrustningList(
    pageData?.mainData?.Utrustning
  );
  if (!(pageData.stock_files && pageData?.stock_files.length)) {
    pageData.stock_files = stockFiles;
  }

  pageData.mileage = pageData.mileage || '';
  const firstStockFilePath = pageData?.stock_files?.[0]?.path;
  pageData.thumbnail =
    pageData.thumbnail || firstStockFilePath || '/shared/fallback.png';
  pageData.sale_price = pageData?.buyInfo?.['Försäljningspris'] || ''; // FIXME reset default value
  pageData.sale_price_num = parseFloat(pageData.sale_price) || 0;
  pageData.formattedPrice = new Intl.NumberFormat('sv', {
    style: 'currency',
    currency: 'SEK',
  }).format(parseFloat(pageData.sale_price) || 0);
  pageData.color = pageData.mainData.Färg || '';
  pageData.transmission = (pageData.mainData || {})['Växellåda'] || '';
  pageData.noOfSeat = (pageData.attributes || {})['Antal sittplatser'] || '';
  pageData.wheelDrive =
    (pageData.attributes || {})['Typ av tvåhjulsdrift'] || '';
  pageData.noOfDoors = (pageData.attributes || {})['Antal dörrar'] || '';
  pageData.horsePower = (pageData.attributes || {})['Hästkrafter'] || '';
  pageData.engineCapacity =
    (pageData.attributes || {})['Motorvolym (cc)'] || '';
  pageData.co2Emission = (pageData.attributes || {})['CO₂, Blandad: min'] || '';
  pageData.cnHighway =
    (pageData.attributes || {})[
      'Bränsleförbrukning: Landsväg (l/100km): min'
    ] || '';
  pageData.cnCity =
    (pageData.attributes || {})['Bränsleförbrukning: Stad (l/100km): min'] ||
    '';
  pageData.cnMixed =
    (pageData.attributes || {})['Bränsleförbrukning: Blandad (l/100km): min'] ||
    '';
  pageData.length = (pageData.attributes || {})['Längd: min'] || '';
  pageData.width = (pageData.attributes || {})['Bredd: min'] || '';
  pageData.height = (pageData.attributes || {})['Höjd: min'] || '';
  pageData.weightWithOutBreak =
    (pageData.attributes || {})['Tjänstevikt: min'] || '';
  pageData.weightBreak = (pageData.attributes || {})['Totalvikt: min'] || '';
  pageData.fuel = (pageData.mainData || {}).Drivmedel || '';

  const vehicleType: Record<string, string> = {
    car: 'Personbil',
    truck: 'Lastbil',
  };
  pageData.carData = pageData.carData || { vehicle_type: '' };
  const currentName =
    (pageData?.carData?.vehicle_type || '').toLowerCase() || '';
  if (Object.hasOwn(vehicleType, currentName)) {
    pageData.carData.vehicle_type = vehicleType[currentName];
  } else {
    pageData.carData.vehicle_type = currentName;
  }
}

function prepareUtrustningList(Utrustning: string): string[] {
  const excludeItems = [
    'Längd',
    'Bredd',
    'Höjd',
    'Axelavstånd',
    'Takhöjd, fram',
    'Takhöjd, bak',
    'Axelutrymme, fram',
    'Axelutrymme, bak',
    'Benutrymme, fram',
    'Benutrymme, bak',
    'Tjänstevikt',
    'Totalvikt',
    'CO₂, Blandad',
    'Kompass',
    'Säkerhetsassistans (Euro NCAP)',
    'Vuxenpassagerare (Euro NCAP)',
    'Barnpassagerare (Euro NCAP)',
    'Oskyddade trafikanter (Euro NCAP)',
  ];
  const utrustningList: string[] = [];

  (Utrustning || '').split('\n').forEach((_utVal) => {
    const ut = _utVal.trim();
    const key = ut.split(':')[0];
    if (!excludeItems.includes(key)) {
      utrustningList.push(ut);
    }
  });
  return utrustningList;
}

function updatePageMeta() {
  const metaProductTitleField = { name: 'product:plural_title', content: '' };
  if (pageData?.carData?.brand && pageData?.carData?.model) {
    metaProductTitleField.content =
      pageData?.carData?.brand + ' | ' + pageData?.carData?.model;
  }
  useHead({
    meta: [
      metaProductTitleField,
      { name: 'product:price:amount', content: pageData.formattedPrice },
      { name: 'product:price:currency', content: 'SEK' },
    ],
  });
}

function slideTo(val: number) {
  currentSlide.value = val;
}

function sliderFullScreen() {
  const doc = globalThis.document;
  const el = (sliderElement?.value || null) as HTMLElement | null;
  if (doc && el) {
    if (!doc.fullscreenElement) {
      el.requestFullscreen().catch((err) => {
        alert(
          `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
    setTimeout(() => {
      handleResize();
      (slideView.value as any)?.updateSlideWidth();
      (thumbView.value as any)?.updateSlideWidth();
    }, 600);
  }
}

function imageFallBack(image: StockFile) {
  image.path = '/shared/fallback-hd.png';
  image.thumb = '/shared/fallback.png';
  image.imageLoaded = true;
}

function imageLoaded(image: StockFile, event: any) {
  image.imageLoaded = true;

  const width = event?.target?.naturalWidth || 0;
  const height = event?.target?.naturalHeight || 0;
  image.ratioMatch =
    width === IDEAL_IMAGE_WIDTH && height === IDEAL_IMAGE_HEIGHT;
}
fetchPageData();

function breadcrumbLink(type: 'brand' | 'model') {
  if (type === 'brand') {
    return `/car-list?brand=${pageData?.carData?.brand}&sort=date&page=1`;
  } else if (type === 'model') {
    return `/car-list?brand=${pageData?.carData?.brand}&model=${pageData?.carData?.model}&sort=date&page=1`;
  }
}

function calculateDownPaymentAmount() {
  finCalculator.downPaymentAmount =
    (pageData.sale_price_num * finCalculator.downPaymentPercentage) / 100;

  finCalculator.displayDownPaymentAmount = priceFormat(
    finCalculator.downPaymentAmount
  );

  finCalculator.displayDiffPrice = priceFormat(
    pageData.sale_price_num - finCalculator.downPaymentAmount
  );
}
function calculateResidualCashAmount() {
  const loanAmount = pageData.sale_price_num - finCalculator.downPaymentAmount;
  finCalculator.residualCashAmount =
    (loanAmount * finCalculator.residualCashPercentage) / 100;

  finCalculator.displayResidualCashAmount = priceFormat(
    finCalculator.residualCashAmount
  );
}

function calculateEMI() {
  // totalMonth:0,
  // principleOfLoan:0,
  // InterestOfLoan:0,
  // totalPayableLoan:0,
  // totalEmiAmount:0,
  // monthlyEmiAmount:0,

  finCalculator.totalMonth = finCalculator.loanTenure * 12;

  finCalculator.principleOfLoan =
    pageData.sale_price_num -
    finCalculator.downPaymentAmount -
    finCalculator.residualCashAmount;

  finCalculator.InterestOfLoan =
    (finCalculator.principleOfLoan *
      cms.rate_of_interest *
      finCalculator.loanTenure) /
    100;

  finCalculator.InterestOfLoan =
    Math.round(finCalculator.InterestOfLoan * 100) / 100;

  finCalculator.totalPayableLoan =
    finCalculator.principleOfLoan + finCalculator.InterestOfLoan;
  finCalculator.totalEmiAmount = finCalculator.totalPayableLoan;

  finCalculator.monthlyEmiAmount =
    finCalculator.totalEmiAmount / finCalculator.totalMonth;

  finCalculator.monthlyEmiAmount =
    Math.round(finCalculator.monthlyEmiAmount * 100) / 100;

  finCalculator.displayMonthlyEmiAmount = priceFormat(
    finCalculator.monthlyEmiAmount
  );

  finCalculator.displayTotalEmiAmount = priceFormat(
    finCalculator.totalEmiAmount
  );

  finCalculator.displayPrincipleOfLoan = priceFormat(
    finCalculator.principleOfLoan
  );
}

function initCalculatorFields() {
  calculateDownPaymentAmount();
  calculateResidualCashAmount();
  calculateEMI();
}

function evFcDownPaymentChange() {
  calculateDownPaymentAmount();
  calculateResidualCashAmount();
  calculateEMI();
}

function evFcLoanTenureChange() {
  calculateEMI();
}

function evFcResidualCashPercentage() {
  calculateDownPaymentAmount();
  calculateResidualCashAmount();
  if (finCalculator.residualCashPercentage <= 15) {
    finCalculator.loanTenureMax = 5;
  } else if (
    finCalculator.residualCashPercentage > 15 &&
    finCalculator.residualCashPercentage <= 36
  ) {
    finCalculator.loanTenureMax = 4;
  } else {
    finCalculator.loanTenureMax = 3;
  }

  finCalculator.loanTenure = Math.min(
    finCalculator.loanTenure,
    finCalculator.loanTenureMax
  );
  evFcLoanTenureChange();
}

function priceFormat(value: number): string {
  return new Intl.NumberFormat('sv', {
    style: 'currency',
    currency: 'SEK',
  }).format(parseFloat(value + '') || 0);
}

function toggleFinCalculator() {
  finCalculator.show = !finCalculator.show;
}

const handleResize = () => {
  const elWidth = (sliderElement.value as any)?.offsetWidth || 0;
  if (elWidth > 0) {
    if (elWidth < 401) {
      totalItem.value = 3;
    } else if (elWidth < 696 && elWidth >= 401) {
      totalItem.value = 4;
    } else if (elWidth < 856 && elWidth >= 696) {
      totalItem.value = 5;
    } else if (elWidth < 1200 && elWidth >= 856) {
      totalItem.value = 6;
    } else if (elWidth >= 1200) {
      totalItem.value = Math.round(elWidth / 200);
    }
  }
};

function imageTouchStartHandler(event: TouchEvent) {
  event.stopPropagation();
}

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <HomeAppHeader></HomeAppHeader>
  <div class="header-spacing">
    <div v-if="loader && noDataFound" class="container d-flex">
      <div class="view-box">
        <div class="spinner-border text-brand" role="status"></div>
      </div>
    </div>
    <div v-if="!loader && noDataFound" class="container d-flex">
      <div class="view-box">
        <SharedAppNodata :text="$t('Car details not found')"></SharedAppNodata>
      </div>
    </div>
    <main v-if="!loader && !noDataFound">
      <div class="main-content-outer">
        <div class="container">
          <div class="top-navigation">
            <ul>
              <li>
                <a :href="breadcrumbLink('brand')">{{
                  pageData?.carData?.brand
                }}</a>
              </li>
              <li>
                <a :href="breadcrumbLink('model')">{{
                  pageData?.carData?.series
                }}</a>
              </li>
              <li>
                <a :href="breadcrumbLink('model')">{{
                  pageData?.carData?.model
                }}</a>
              </li>
            </ul>
          </div>
          <div class="top-content-block">
            <div class="row">
              <div class="col-md-12 col-lg-8">
                <div
                  v-if="pageData?.stock_files?.length"
                  ref="sliderElement"
                  class="slider-wrapper"
                  :class="{
                    'hide-arrows': pageData?.stock_files?.length === 1,
                  }"
                >
                  <div class="large-image-block">
                    <div class="carousel-ui-wrapper">
                      <div class="tool-wrapper tw-top">
                        <div class="full-screen hide-in-full-screen">
                          <button class="btn" @click="sliderFullScreen()">
                            <svgFullScreen></svgFullScreen>
                          </button>
                        </div>
                        <div class="full-screen show-in-full-screen">
                          <button class="btn" @click="sliderFullScreen()">
                            <svgFullScreenExit></svgFullScreenExit>
                          </button>
                        </div>
                      </div>
                      <div class="tool-wrapper tw-bottom">
                        <div class="count-section">
                          <div class="camera-icon">
                            <svgCamera></svgCamera>
                          </div>
                          <div class="count">
                            {{ currentSlide + 1 }} /
                            {{ pageData?.stock_files?.length }}
                          </div>
                        </div>
                      </div>
                      <Carousel
                        ref="slideView"
                        v-model="currentSlide"
                        :items-to-show="1"
                        :wrap-around="false"
                      >
                        <Slide
                          v-for="(image, index) in pageData?.stock_files"
                          :key="index"
                        >
                          <div class="carousel__item slide">
                            <img
                              :class="{
                                'pre-render': !image.imageLoaded,
                                'show-image': image.imageLoaded,
                                'ratio-match': image.ratioMatch,
                                'ratio-mismatch': !image.ratioMatch,
                              }"
                              :src="image.path"
                              class="slider-view-image"
                              @load="imageLoaded(image, $event)"
                              @error="imageFallBack(image)"
                              @touchstart="imageTouchStartHandler($event)"
                            />
                            <div
                              v-if="!image.imageLoaded"
                              class="slider-loader"
                            >
                              <div
                                class="spinner-border text-brand"
                                role="status"
                              ></div>
                            </div>
                          </div>
                        </Slide>
                        <template #addons>
                          <Navigation>
                            <template #next>
                              <svgSliderNext></svgSliderNext>
                            </template>
                            <template #prev>
                              <svgSliderPrev></svgSliderPrev>
                            </template>
                          </Navigation>
                        </template>
                      </Carousel>
                    </div>
                  </div>
                  <div class="image-strip">
                    <Carousel
                      ref="thumbView"
                      v-model="currentSlide"
                      :snap-align="snapAlign"
                      :items-to-show="totalItem"
                      :wrap-around="false"
                    >
                      <Slide
                        v-for="(image, index) in pageData?.stock_files"
                        :key="index"
                      >
                        <div
                          class="carousel__item thumbs"
                          :class="{
                            active: currentSlide === index,
                          }"
                          @click="slideTo(index)"
                        >
                          <img
                            :class="{ 'show-image': image.imageLoaded }"
                            :src="image.thumb"
                            class="slider-thumb-image"
                            @error="imageFallBack(image)"
                          />
                          <div v-if="!image.imageLoaded" class="slider-loader">
                            <div
                              class="spinner-border spinner-border-sm text-brand"
                              role="status"
                            ></div>
                          </div>
                        </div>
                      </Slide>
                    </Carousel>
                  </div>
                </div>
              </div>
              <div
                :class="{
                  'col-md-12 col-lg-4': pageData?.stock_files?.length,
                  'col-md-12 col-lg-12': !pageData?.stock_files?.length,
                }"
              >
                <div class="right-main-content-block">
                  <div class="right-car-detail">
                    <div class="single-block">
                      <div class="main-title-block">
                        <span class="model-name">
                          <span class="me-1">{{
                            pageData?.carData?.model
                          }}</span
                          ><span class="fw-regular">|</span></span
                        >
                        <span class="mfd-name">{{
                          pageData?.carData?.brand
                        }}</span>
                      </div>
                      <div class="main-model-desc">
                        {{ pageData?.description }}
                      </div>
                    </div>
                    <div class="detail-highlights">
                      <div class="row">
                        <div class="col">
                          <div class="title">
                            {{ $t('mi') }}
                          </div>
                          <div class="value">
                            {{ pageData?.mileage || '--' }}
                            {{ $t('mi') }}
                          </div>
                        </div>
                        <div class="col">
                          <div class="title">
                            {{ $t('Fuel') }}
                          </div>
                          <div class="value">
                            {{ pageData?.fuel }}
                          </div>
                        </div>
                        <div class="col">
                          <div class="title">
                            {{ $t('Model') }}
                          </div>
                          <div class="value">
                            {{ pageData?.carData?.model_year }}
                          </div>
                        </div>
                        <div class="col">
                          <div class="title">
                            {{ $t('Transmission') }}
                          </div>
                          <div class="value">
                            {{ pageData?.transmission }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="pricing-section">
                      <h2>
                        {{ pageData?.formattedPrice }}
                      </h2>
                      <span class="admin-charges d-none"
                        >+ administrationsavgift 995 kr</span
                      >
                    </div>
                    <div class="main-actions-buttons-section d-grid gap-2">
                      <button
                        class="btn custom-btn-action btn-block"
                        @click="showInterestPopup(EnquiryType.talk)"
                      >
                        {{ $t('Talk to a salesperson') }}
                      </button>
                      <button
                        class="btn custom-btn-action green btn-block upper-case"
                        @click="showInterestPopup(EnquiryType.reserve)"
                      >
                        {{ $t('Reserve the car') }}
                      </button>
                    </div>
                  </div>
                  <div class="call-back-section">
                    <div class="call-content">
                      <div class="call-text">{{ $t('Call Us Now') }} :</div>
                      <div class="phone-number">
                        <a disabled :href="cms.phoneUrl">{{ cms.phone }}</a>
                      </div>
                    </div>
                    <div class="call-icon">
                      <svgCall></svgCall>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="information-blocks fin-calculator">
            <div class="card single-custom-card">
              <div class="card-head">
                <h3 class="card-title fin-title">
                  <span> Finanskalkylator</span>
                  <button
                    :class="{ 'open-effect': finCalculator.show }"
                    class="fin-calc-expand"
                    @click="toggleFinCalculator()"
                  >
                    <svgExpandCircle></svgExpandCircle>
                  </button>
                </h3>
              </div>
              <div v-show="finCalculator.show" class="card-body">
                <div class="row">
                  <div class="col-md-6 col-sm-12 col-border">
                    <div class="row info-area m-2">
                      <div class="col-12 fc-col">
                        <div class="title">Kontantinsats</div>
                        <div class="value">
                          {{ finCalculator.displayDownPaymentAmount }}
                          ({{ finCalculator.downPaymentPercentage }}% av
                          {{ pageData.formattedPrice }})
                        </div>
                        <div class="controller">
                          <div class="range-wrapper">
                            <span class="left limit-label">1%</span>
                            <input
                              v-model.number="
                                finCalculator.downPaymentPercentage
                              "
                              type="range"
                              min="1"
                              max="50"
                              step="1"
                              class="form-range"
                              @input="evFcDownPaymentChange"
                            />
                            <span class="right limit-label">50%</span>
                          </div>
                        </div>
                      </div>
                      <div class="col-12 fc-col">
                        <div class="title">Lånetid</div>
                        <div class="value">
                          {{ finCalculator.loanTenure }}
                          {{ finCalculator.loanTenure > 1 ? 'År' : 'År' }}
                          ({{ finCalculator.totalMonth }}
                          {{
                            finCalculator.totalMonth > 1 ? 'Månader' : 'Månad'
                          }})
                        </div>
                        <div class="controller">
                          <div class="range-wrapper">
                            <span class="left limit-label">1</span>
                            <input
                              v-model.number="finCalculator.loanTenure"
                              type="range"
                              min="1"
                              :max="finCalculator.loanTenureMax"
                              step="1"
                              class="form-range"
                              @input="evFcLoanTenureChange"
                            />
                            <span class="right limit-label">{{
                              finCalculator.loanTenureMax
                            }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="col-12 fc-col">
                        <div class="title">Restvärde</div>
                        <div class="value">
                          {{ finCalculator.displayResidualCashAmount }}
                          ({{ finCalculator.residualCashPercentage }}% av
                          {{ finCalculator.displayDiffPrice }})
                        </div>
                        <div class="controller">
                          <div class="range-wrapper">
                            <span class="left limit-label">1%</span>
                            <input
                              v-model.number="
                                finCalculator.residualCashPercentage
                              "
                              type="range"
                              min="1"
                              max="50"
                              step="1"
                              class="form-range"
                              @input="evFcResidualCashPercentage"
                            />
                            <span class="right limit-label">50%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <div class="row info-area m-2">
                      <div class="col-12 fc-col">
                        <div class="title">Bilens pris</div>
                        <div class="value">
                          {{ pageData?.formattedPrice }}
                        </div>
                      </div>
                      <div class="col-12 fc-col">
                        <div class="title">Ränta</div>
                        <div class="value">{{ cms.rate_of_interest }}%</div>
                      </div>
                      <div class="col-12 fc-col">
                        <div class="title">Avbetalningstid</div>
                        <div class="value">
                          {{ finCalculator.totalMonth }}
                        </div>
                      </div>
                      <div class="col-12 fc-col">
                        <div class="title">Totalt lånebelopp</div>
                        <div class="value price-value">
                          {{ finCalculator.displayPrincipleOfLoan }}
                        </div>
                      </div>
                      <div class="col-12 fc-col">
                        <div class="title">Månadskostnad</div>
                        <div class="value">
                          <span class="emi-price-value">
                            {{ finCalculator.displayMonthlyEmiAmount }} </span
                          >/ månad
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card single-custom-card">
              <div class="card-body">
                <h3 class="card-title">
                  {{ $t('General information') }}
                </h3>
                <p>{{ pageData?.description }}</p>
                <div class="row info-area">
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Mileage') }}
                    </div>
                    <div class="value">
                      {{ pageData?.mileage || '--' }}
                      {{ $t('mi') }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Number of seats') }}
                    </div>
                    <div class="value">
                      {{ pageData?.noOfSeat }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Fuel') }}
                    </div>
                    <div class="value">
                      {{ pageData.fuel }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Type of gearbox') }}
                    </div>
                    <div class="value">
                      {{ pageData.transmission }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Manufacturing Year') }}
                    </div>
                    <div class="value">
                      {{ pageData.year_of_manufacture }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Registration number') }}
                    </div>
                    <div class="value">
                      {{ pageData.registration_number }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Color') }}
                    </div>
                    <div class="value">
                      {{ pageData.color }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info d-none">
                    <div class="title">
                      {{ $t('No. of Owner(s)') }}
                    </div>
                    <div class="value"></div>
                  </div>
                  <div class="col-md-4 single-info d-none">
                    <div class="title">
                      {{ $t('Insurance') }}
                    </div>
                    <div class="value"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card single-custom-card">
              <div class="card-body">
                <h3 class="card-title">
                  {{ $t('Technical information') }}
                </h3>
                <h4 class="card-sub-title">
                  {{ $t('Basic') }}
                </h4>
                <div class="row info-area">
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Type') }}
                    </div>
                    <div class="value">
                      {{ pageData?.carData?.vehicle_type }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Body') }}
                    </div>
                    <div class="value">
                      {{ pageData?.mainData?.Kaross }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Drive wheel') }}
                    </div>
                    <div class="value">
                      {{ pageData?.wheelDrive || '--' }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Color') }}
                    </div>
                    <div class="value">
                      {{ pageData?.color }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('No of Doors') }}
                    </div>
                    <div class="value">
                      {{ pageData?.noOfDoors }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Effect') }}
                    </div>
                    <div class="value">
                      {{ pageData?.horsePower }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Engine capacity (cc)') }}
                    </div>
                    <div class="value">
                      {{ pageData?.engineCapacity }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Carbon dioxide emissions') }}
                    </div>
                    <div class="value">
                      {{ pageData?.co2Emission }}
                    </div>
                  </div>
                </div>
                <h4 class="card-sub-title">
                  {{ $t('Consumption') }}
                </h4>
                <div class="row info-area">
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Way') }}
                    </div>
                    <div class="value">
                      {{ pageData.cnHighway }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('City') }}
                    </div>
                    <div class="value">
                      {{ pageData.cnCity }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Combined driving') }}
                    </div>
                    <div class="value">
                      {{ pageData.cnMixed }}
                    </div>
                  </div>
                </div>
                <h4 class="card-sub-title">
                  {{ $t('Measure') }}
                </h4>
                <div class="row info-area">
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Length') }}
                    </div>
                    <div class="value">
                      {{ pageData.length }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Width') }}
                    </div>
                    <div class="value">
                      {{ pageData.width }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Height') }}
                    </div>
                    <div class="value">
                      {{ pageData.height }}
                    </div>
                  </div>
                </div>
                <h4 class="card-sub-title">
                  {{ $t('Weight') }}
                </h4>
                <div class="row info-area">
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('With brakes') }}
                    </div>
                    <div class="value">
                      {{ pageData.weightBreak }}
                    </div>
                  </div>
                  <div class="col-md-4 single-info">
                    <div class="title">
                      {{ $t('Without brakes') }}
                    </div>
                    <div class="value">
                      {{ pageData.weightWithOutBreak }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card single-custom-card">
              <div class="card-body">
                <h3 class="card-title">
                  {{ $t('Equipment information') }}
                </h3>
                <div class="equipment-info equipment-grid">
                  <div
                    v-for="(item, index) in pageData.utrustningList"
                    :key="index"
                    class="equipment-grid-item"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HomeCardList></HomeCardList>
    </main>
  </div>
  <HomeAppFooter></HomeAppFooter>
</template>

<style lang="scss" scoped>
.thumbs,
.slide {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(255 255 255);
  position: relative;
  img {
    max-width: 100%;
  }
}

.slide {
  width: 100%;
  .slider-view-image {
    object-fit: cover;
    visibility: hidden;
    max-height: 500px;
    max-width: 100%;
    aspect-ratio: 16 / 9;
    &.show-image {
      visibility: visible;
    }
    &.pre-render {
      height: 300px;
    }
    &.ratio-mismatch {
      aspect-ratio: 16 / 9;
      width: 100%;
    }
  }
}

.thumbs {
  max-width: 160px;
  max-height: 90px;
  margin: 3px;
  .slider-thumb-image {
    object-fit: cover;
    visibility: hidden;
    width: 100%;
    height: auto;
    max-height: 90px;
    aspect-ratio: 16 / 9;
    &.show-image {
      visibility: visible;
    }
  }
}

.view-box {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}
.slider-loader {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
