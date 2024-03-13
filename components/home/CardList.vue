<script setup lang="ts">
import type { CardItem } from '@/models/card';
const config = useRuntimeConfig();
const router = useRouter();
const carList = reactive<CardItem[]>([]);

const emit = defineEmits(['count']);

const loader = ref(false);
const perPage = 4;
const currentPage = 1;
const isLastPage = ref(false);

const showViewMore = ref(false);

function openCard(item: CardItem) {
  router.push(`/car-details/${item.id}`);
}

async function fetchCar() {
  loader.value = true;
  let response: any = null;
  try {
    response = await $fetch(
      `${config.public.API_BASE_URL}/dealership/${useShopId().value}/cars/list`,
      { params: { page: currentPage, per_page: perPage, sort: 'date' } }
    );
  } catch (e) {
    console.error(e);
    response = null;
  }
  if (response && response.code === 200) {
    isLastPage.value = !response.result.links.next;
    showViewMore.value = response.result.meta.total > perPage;
    processCarDetails(response.result.data);
  }
  loader.value = false;
}

function processCarDetails(data: any[]) {
  data.forEach((_car: any) => {
    _car.description = _car.carData.car_name.replace(_car.brand, '');
    _car.mileage = _car.mileage || '';
    _car.thumbnail = _car.thumbnail || '/shared/fallback.png';
    _car.sale_price = _car?.buyInfo?.['Försäljningspris'] || '';
    _car.formattedPrice = new Intl.NumberFormat('sv', {
      style: 'currency',
      currency: 'SEK',
    }).format(parseInt(_car.sale_price) || 0);
    _car.transmission = (_car.mainData || {})['V\u00E4xell\u00E5da'] || '';
    _car.fuel = (_car.mainData || {}).Drivmedel || '';
    carList.push(_car as CardItem);
    emit('count', carList.length);
  });
}

function fallback(car: CardItem) {
  car.thumbnail = '/shared/fallback.png';
}

function viewMore() {
  router.push({ path: '/car-list' });
}

carList.splice(0);
fetchCar();
</script>

<template>
  <div v-if="carList.length" class="container card-list">
    <h1 class="heading-main">
      {{ $t('Latest incoming cars') }}
    </h1>
    <div class="card-list-block">
      <div class="row">
        <template v-for="(car, index) in carList" :key="index">
          <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12 column-wrapper">
            <div class="card-item" @click="openCard(car)">
              <div class="image-holder">
                <img
                  :src="car.thumbnail"
                  :alt="car.model"
                  @error="fallback(car)"
                />
              </div>
              <div class="card-details">
                <div class="title-box">
                  <a :href="'/car-details/' + car.id" class="card-car-title">
                    <span class="model-name fw-bold"
                      ><span class="me-1">{{ car.model }}</span
                      ><span class="fw-regular">|</span></span
                    >
                    <span class="brand-name fw-semi-bold ms-1">
                      {{ car.brand }}</span
                    >
                  </a>
                  <p class="short-spec">
                    {{ car.description }}
                  </p>
                </div>
                <hr />
                <div class="car-features-head">
                  {{ $t('Features') }}
                </div>
                <div class="car-features-grid">
                  <div class="car-features-grid-item">
                    <div class="label">
                      {{ $t('mi') }}
                    </div>
                    <div class="value">
                      {{ car.mileage || '--' }}
                      {{ $t('mi') }}
                    </div>
                  </div>
                  <div class="car-features-grid-item">
                    <div class="label">
                      {{ $t('Fuel') }}
                    </div>
                    <div class="value">
                      {{ car.fuel }}
                    </div>
                  </div>
                  <div class="car-features-grid-item">
                    <div class="label">
                      {{ $t('Model') }}
                    </div>
                    <div class="value">
                      {{ car.year }}
                    </div>
                  </div>
                  <div class="car-features-grid-item">
                    <div class="label">
                      {{ $t('Transmission') }}
                    </div>
                    <div class="value">
                      {{ car.transmission }}
                    </div>
                  </div>
                </div>
                <hr />
                <div class="car-price-section">
                  <div class="total">
                    {{ car.formattedPrice }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <button
      v-if="showViewMore"
      class="btn btn-brand view-more"
      :disabled="loader"
      @click="viewMore()"
    >
      <span> {{ $t('View More') }}</span>
    </button>
  </div>
</template>
