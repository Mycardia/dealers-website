<script lang="ts" setup>
import _ from 'lodash';
import svgCloseIcon from '@/assets/svg/list-page/chip-close.svg';
import { CardItem } from '@/models/card';
import { useFilterStore } from '@/store/filter-store';
import svgFilter from '@/assets/svg/list-page/filter.svg';

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const i18n = useI18n();

const { brandList, chassisList, modelList, yearList, milageList, fetchModel } =
  useFilterStore();

const sortLabels: any = {
  name: i18n.t('Brand: A-Z'),
  date: i18n.t('Newest'),
};

const sortByList = reactive(['name', 'date']);
const sortBy = ref('date');

const perPageList = reactive([10, 20, 30, 40, 50]);
const perPage = ref(9);

const currentPage = ref(1);

const searchField = ref('');

const selectedBrand = ref(null);
const selectedModel = ref([]);
const selectedChassis = ref([]);

const selectedFromYear = ref(null);
const selectedToYear = ref(null);
const selectedFromMilage = ref(null);
const selectedToMilage = ref(null);

const loader = ref(false);

const fromYearList = computed(() => yearList);
const fromMilageList = computed(() => milageList);

const toYearList = computed(() =>
  yearList.filter((val) => val >= (selectedFromYear.value || 0))
);
const toMilageList = computed(() =>
  milageList.filter((val) => val >= (selectedFromMilage.value || 0))
);

const cardList: CardItem[] = reactive([]);
const paginationMeta: any = reactive({});
function brandSelected() {
  modelList.splice(0);
  selectedModel.value = [];
  fetchModel(selectedBrand.value || '');
  applyFilterChanges();
}

function fromMilageSelected() {
  if ((selectedFromMilage.value || 0) > (selectedToMilage.value || 0)) {
    selectedToMilage.value = null;
  }
  applyFilterChanges();
}

function fromYearSelected() {
  if ((selectedFromYear.value || 0) > (selectedToYear.value || 0)) {
    selectedToYear.value = null;
  }
  applyFilterChanges();
}

function reset() {
  selectedBrand.value = null;
  selectedModel.value = [];
  selectedChassis.value = [];
  selectedFromYear.value = null;
  selectedToYear.value = null;
  selectedFromMilage.value = null;
  selectedToMilage.value = null;
  searchField.value = '';

  perPage.value = 9;
  sortBy.value = 'date';
  currentPage.value = 1;
  modelList.splice(0);

  applyFilterChanges();
}

function mapSortLabels(item: string) {
  return sortLabels[item];
}

function applyFilterChanges(pageNumber?: number) {
  if (typeof pageNumber === 'number') {
    (currentPage as any).value = pageNumber;
  } else {
    (currentPage as any).value = 1;
  }
  const filterArray = prepareSearchQuery();
  router.replace({ query: filterArray });
}

const searchBoxChanges = _.debounce(applyFilterChanges, 800); // call applyFilterChanges() in 1000 sec delay

function prepareSearchQuery() {
  const filterArray: any = {};
  if (selectedBrand.value) {
    filterArray.brand = encodeURIComponent(selectedBrand.value);
  }

  if (selectedModel.value.length) {
    filterArray.model = selectedModel.value
      .map((val) => encodeURIComponent(val))
      .join(',');
  }

  if (selectedChassis.value.length) {
    filterArray.chassis = selectedChassis.value
      .map((val) => encodeURIComponent(val))
      .join(',');
  }

  if (selectedFromYear.value) {
    filterArray.formYear = encodeURIComponent(selectedFromYear.value);
  }

  if (selectedToYear.value) {
    filterArray.toYear = encodeURIComponent(selectedToYear.value);
  }

  if (selectedFromMilage.value) {
    filterArray.fromMilage = encodeURIComponent(selectedFromMilage.value);
  }

  if (selectedToMilage.value) {
    filterArray.toMilage = encodeURIComponent(selectedToMilage.value);
  }

  if (sortBy.value) {
    filterArray.sort = encodeURIComponent(sortBy.value);
  }
  if (currentPage.value) {
    filterArray.page = encodeURIComponent(currentPage.value);
  }

  if (searchField.value) {
    filterArray.search = encodeURIComponent(searchField.value);
  }
  return filterArray;
}
function applySearchQuery(query: any) {
  if (query.brand) {
    (selectedBrand as any).value =
      decodeURIComponent(query.brand || '') || null;
  }

  if (query.model) {
    selectedModel.value = query.model
      .split(',')
      .map((val: any) => decodeURIComponent(val));
  }

  if (query.chassis) {
    selectedChassis.value = query.chassis
      .split(',')
      .map((val: any) => decodeURIComponent(val));
  }

  if (query.formYear) {
    (selectedFromYear as any).value =
      decodeURIComponent(query.formYear || '') || null;
  }

  if (query.toYear) {
    (selectedToYear as any).value =
      decodeURIComponent(query.toYear || '') || null;
  }

  if (query.fromMilage) {
    (selectedFromMilage as any).value =
      decodeURIComponent(query.fromMilage || '') || null;
  }

  if (query.toMilage) {
    (selectedToMilage as any).value =
      decodeURIComponent(query.toMilage || '') || null;
  }

  if (query.sort) {
    (sortBy as any).value = decodeURIComponent(query.sort || '') || null;
  }

  if (query.page) {
    (currentPage as any).value = decodeURIComponent(query.page || '') || null;
  }

  if (query.search) {
    (searchField as any).value = decodeURIComponent(query.search || '') || '';
  }
  search();
}

async function search() {
  const url = `${config.public.API_BASE_URL}/dealership/${
    useShopId().value
  }/cars/list`;
  loader.value = true;
  let response: any = null;

  const payload: any = {};
  if (currentPage.value) {
    payload.page = currentPage.value;
  }
  if (perPage.value) {
    payload.per_page = perPage.value;
  }
  if (sortBy.value) {
    payload.sort = sortBy.value;
  }
  if (searchField.value) {
    payload.search = searchField.value;
  }

  if (selectedFromYear.value) {
    payload.year_from = selectedFromYear.value;
  }
  if (selectedToYear.value) {
    payload.year_to = selectedToYear.value;
  }
  if (selectedFromMilage.value) {
    payload.mileage_from = selectedFromMilage.value;
  }
  if (selectedToMilage.value) {
    payload.mileage_to = selectedToMilage.value;
  }

  if (selectedBrand.value) {
    payload[`brand[]`] = selectedBrand.value;
  }
  if (selectedModel.value) {
    selectedModel.value.forEach((item, index) => {
      payload[`model[${index}]`] = item;
    });
  }
  if (selectedChassis.value) {
    selectedChassis.value.forEach((item, index) => {
      payload[`chassis[${index}]`] = item;
    });
  }

  try {
    const asyncData = await useFetch(url, { params: payload });
    response = asyncData.data.value;
  } catch (e) {
    console.error(e);
    response = null;
  }
  if (response && response.code === 200) {
    cardList.splice(0);
    processCarDetails(response?.result?.data || []);
    const meta = response?.result?.meta;
    for (const key in meta) {
      paginationMeta[key] = meta[key];
    }
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
    cardList.push(_car as CardItem);
  });
}

applySearchQuery(route.query);
watch(
  () => route.query,
  () => {
    applySearchQuery(route.query);
  }
);

function removeArrayChip(arr: string[], index: number) {
  arr.splice(index, 1);
  applyFilterChanges();
}

function openCard(item: CardItem) {
  router.push(`/car-details/${item.id}`);
}

function fallback(car: CardItem) {
  car.thumbnail = '/shared/fallback.png';
}

function paginationChange(newPage: number) {
  applyFilterChanges(newPage);
}
</script>

<template>
  <HomeAppHeader></HomeAppHeader>
  <main class="header-spacing">
    <div class="listing-section main-content-outer">
      <div class="container">
        <div class="top-navigation">
          <ul>
            <li>
              <NuxtLink href="/">
                {{ $t('Home') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink href="/car-list">
                {{ $t('Buy car') }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="main-item-list">
      <div class="container">
        <div class="row">
          <div class="col-lg-3">
            <div
              id="offcanvasWithBackdrop"
              class="offcanvas offcanvas-start custom-left-menu"
              tabindex="-1"
              aria-labelledby="offcanvasWithBackdropLabel"
            >
              <div class="offcanvas-header d-flex d-lg-none">
                <button
                  type="button"
                  class="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div class="offcanvas-body">
                <div class="left-filters height-fix">
                  <div class="filter-header">
                    <div class="title">
                      {{ $t('Filters') }}
                    </div>
                    <a class="reset-section" @click="reset()">
                      {{ $t('RESET') }}
                    </a>
                  </div>
                  <div class="single-filter-block">
                    <div class="single-filter-item d-lg-none">
                      <label class="form-label">{{ $t('Sort By') }}</label>
                      <v-select
                        v-model="sortBy"
                        :allow-empty="true"
                        class="filter-option-list"
                        :placeholder="$t('Sort By')"
                        select-label=""
                        deselect-label=""
                        selected-label="✓"
                        :custom-label="mapSortLabels"
                        :options="sortByList"
                        @select="applyFilterChanges()"
                        @remove="applyFilterChanges()"
                      ></v-select>
                    </div>
                    <div class="single-filter-item">
                      <label class="form-label">{{ $t('Search') }}</label>
                      <input
                        v-model="searchField"
                        class="form-control"
                        :placeholder="$t('Search')"
                        @input="searchBoxChanges()"
                        @keydown.enter="applyFilterChanges()"
                      />
                    </div>
                    <div class="single-filter-item">
                      <label class="form-label">{{ $t('Chassis') }}</label>
                      <v-select
                        v-model="selectedChassis"
                        :allow-empty="true"
                        :multiple="true"
                        class="filter-option-list"
                        :placeholder="$t('Chassis')"
                        select-label=""
                        deselect-label=""
                        selected-label="✓"
                        :options="chassisList"
                        @select="applyFilterChanges()"
                        @remove="applyFilterChanges()"
                      ></v-select>
                    </div>
                    <div class="single-filter-item">
                      <label class="form-label">{{ $t('Brands') }}</label>
                      <v-select
                        v-model="selectedBrand"
                        :allow-empty="true"
                        class="filter-option-list"
                        :placeholder="$t('Brands')"
                        select-label=""
                        deselect-label=""
                        selected-label="✓"
                        :options="brandList"
                        @select="brandSelected()"
                        @remove="brandSelected()"
                      ></v-select>
                    </div>
                    <div class="single-filter-item">
                      <label class="form-label">{{ $t('Model') }}</label>
                      <v-select
                        v-model="selectedModel"
                        :disabled="!selectedBrand"
                        :allow-empty="true"
                        :multiple="true"
                        class="filter-option-list"
                        :placeholder="$t('Model')"
                        select-label=""
                        deselect-label=""
                        selected-label="✓"
                        :options="modelList"
                        @select="applyFilterChanges()"
                        @remove="applyFilterChanges()"
                      >
                      </v-select>
                    </div>
                    <div class="single-filter-item">
                      <label class="form-label">{{ $t('Mileage') }}</label>
                      <div class="row">
                        <div class="col-6">
                          <v-select
                            v-model="selectedFromMilage"
                            :allow-empty="true"
                            class="filter-option-list"
                            :placeholder="$t('from')"
                            select-label=""
                            deselect-label=""
                            selected-label="✓"
                            :options="fromMilageList"
                            @select="fromMilageSelected()"
                            @remove="fromMilageSelected()"
                          ></v-select>
                        </div>
                        <div class="col-6">
                          <v-select
                            v-model="selectedToMilage"
                            :allow-empty="true"
                            class="filter-option-list"
                            :placeholder="$t('to')"
                            select-label=""
                            deselect-label=""
                            selected-label="✓"
                            :options="toMilageList"
                            @select="applyFilterChanges()"
                            @remove="applyFilterChanges()"
                          ></v-select>
                        </div>
                      </div>
                    </div>
                    <div class="single-filter-item">
                      <label class="form-label">{{
                        $t('Year of Manufacture')
                      }}</label>
                      <div class="row">
                        <div class="col-6">
                          <v-select
                            v-model="selectedFromYear"
                            :allow-empty="true"
                            class="filter-option-list"
                            :placeholder="$t('from')"
                            select-label=""
                            deselect-label=""
                            selected-label="✓"
                            :options="fromYearList"
                            @select="fromYearSelected()"
                            @remove="fromYearSelected()"
                          ></v-select>
                        </div>
                        <div class="col-6">
                          <v-select
                            v-model="selectedToYear"
                            :allow-empty="true"
                            class="filter-option-list"
                            :placeholder="$t('to')"
                            select-label=""
                            deselect-label=""
                            selected-label="✓"
                            :options="toYearList"
                            @select="applyFilterChanges()"
                            @remove="applyFilterChanges()"
                          ></v-select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-9">
            <div class="top-detail-section">
              <h2>
                {{ $t('car_listing_description_main') }}
              </h2>
              <p>
                {{ $t('car_listing_description_sub') }}
              </p>
            </div>
            <div class="filter-section">
              <template v-if="cardList && cardList.length > 0">
                <div class="page-number-section">
                  {{ $t('Showing') }}:
                  <span class="car-number">
                    {{ paginationMeta.total }}
                    {{ $t('Cars') }} </span
                  >({{ $t('Page') }} {{ paginationMeta.current_page }} /
                  {{ paginationMeta.last_page }})
                </div>
                <div class="sort-filter d-none d-lg-block">
                  <v-select
                    v-model="sortBy"
                    :allow-empty="true"
                    class="filter-option-list"
                    :placeholder="$t('Sort By')"
                    select-label=""
                    deselect-label=""
                    selected-label="✓"
                    :custom-label="mapSortLabels"
                    :options="sortByList"
                    @select="applyFilterChanges()"
                    @remove="applyFilterChanges()"
                  ></v-select>
                </div>
              </template>
              <button
                class="btn filter-button d-flex d-lg-none"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasWithBackdrop"
                aria-controls="offcanvasWithBackdrop"
              >
                <svgFilter></svgFilter>
              </button>
            </div>
            <div class="badges-section">
              <div
                v-for="(ch, index) in selectedChassis"
                :key="index"
                class="badge rounded-pill custom-badge"
              >
                <span class="title">{{ ch }}</span>
                <span
                  class="close-icon"
                  @click="removeArrayChip(selectedChassis, index)"
                >
                  <svgCloseIcon></svgCloseIcon>
                </span>
              </div>
              <div
                v-for="(md, index) in selectedModel"
                :key="index"
                class="badge rounded-pill custom-badge"
              >
                <span class="title">{{ md }}</span>
                <span
                  class="close-icon"
                  @click="removeArrayChip(selectedModel, index)"
                >
                  <svgCloseIcon></svgCloseIcon>
                </span>
              </div>
              <div v-if="selectedBrand" class="badge rounded-pill custom-badge">
                <span class="title">{{ selectedBrand }}</span>
                <span
                  class="close-icon"
                  @click="
                    selectedBrand = null;
                    applyFilterChanges();
                  "
                >
                  <svgCloseIcon></svgCloseIcon>
                </span>
              </div>
            </div>
            <div v-if="loader" class="row">
              <div class="view-box">
                <div class="spinner-border text-brand" role="status"></div>
              </div>
            </div>
            <div v-if="!loader && !(cardList.length > 0)" class="row">
              <div class="view-box">
                <SharedAppNodata :text="$t('No items found')"></SharedAppNodata>
              </div>
            </div>
            <div
              v-if="!loader && cardList.length > 0"
              class="row min-height-fix"
            >
              <template v-for="(car, index) in cardList" :key="index">
                <div
                  class="col-lg-4 col-md-6 col-sm-12 col-xs-12 column-wrapper"
                >
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
                        <a
                          :href="'/car-details/' + car.id"
                          class="card-car-title"
                        >
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
            <div
              v-if="cardList && cardList.length > 0"
              class="pagination-section"
            >
              <div class="page-number-section">
                {{ $t('Showing') }} {{ paginationMeta.from }} -
                {{ paginationMeta.to }} of
                {{ paginationMeta.total }}
                results
              </div>
              <SharedAppPagination
                v-if="paginationMeta.last_page !== 1"
                :current-page="paginationMeta.current_page"
                :total-pages="paginationMeta.last_page"
                @page-changed="paginationChange($event)"
              ></SharedAppPagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <HomeAppFooter></HomeAppFooter>
</template>

<style lang="scss" scoped>
.view-box {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 450px;
  width: 100%;
}

.main-item-list .left-filters.height-fix {
  // TODO Remove the height fix class for further working on the filter list
  padding-bottom: 5px;
  min-height: unset;

  .single-filter-block {
    border-bottom: unset;
  }
}

.min-height-fix {
  min-height: 450px;
}

.no-items-found {
  color: var(--bs-gray-600);
  font-style: italic;
}

input.form-control::placeholder {
  color: #adadad;
}
</style>
