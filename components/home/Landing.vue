<script setup lang="ts">
import svgSearchIcon from '@/assets/svg/search.svg';
import svgDoubleArrowIcon from '@/assets/svg/double-arrow.svg';
import { useCMSStore } from '@/store/cms-store';
import { useFilterStore } from '~~/store/filter-store';
import {
  isSwedishPhoneNumberValid,
  isEmailValid,
  isRequired,
  isMileageValid,
  isRegNoValid,
} from '@/util/form-validators';
import {
  onFieldChange,
  onBlur,
  checkFormErrors,
  formError,
  formValid,
  markDirtyAll,
  formSubmitHttp,
  FormControlBase,
  resetForm,
} from '@/util/form-control';

const activeTab: Ref<'SELL' | 'SEARCH'> = ref('SELL');
const router = useRouter();
const { homePageData: cms } = useCMSStore();
const { brandList, chassisList, modelList, yearList, milageList, fetchModel } =
  useFilterStore();

const config = useRuntimeConfig();

const form: Record<string, FormControlBase> = generateForm();
const loader = ref(false);

const selectedBrand = ref(null);
const selectedModel = ref([]);
const selectedChassis = ref([]);

const selectedFromYear = ref(null);
const selectedToYear = ref(null);
const selectedFromMilage = ref(null);
const selectedToMilage = ref(null);
const inlineSearchField = ref('');

const fromYearList = computed(() => yearList);
const fromMilageList = computed(() => milageList);

const toYearList = computed(() =>
  yearList.filter((val) => val >= (selectedFromYear.value || 0))
);
const toMilageList = computed(() =>
  milageList.filter((val) => val >= (selectedFromMilage.value || 0))
);

function brandSelected() {
  modelList.splice(0);
  selectedModel.value = [];
  fetchModel(selectedBrand.value || '');
}
/*
This code block is needed for future references

function milageChangeValidate(){
  if(selectedToMilage.value !=='' && selectedFromMilage.value !==''){
    const to =  parseInt(selectedToMilage.value);
    const from = parseInt(selectedFromMilage.value);
    if(to === 0 ){
      selectedToMilage.value ='';
    }else  if(from === 0 || from >= to ){
      selectedFromMilage.value ='';
    }
  }
}
const milageEnterDebounce  =   _.debounce(milageChangeValidate, 200);
const milageInputDebounce =   _.debounce(milageChangeValidate, 400);
function mileageChanges(event: Event, target: 'to' | 'from') {
  const inputEl = event.target as HTMLInputElement;
  const rowVal = inputEl.value;
  const parsedVal = rowVal.replace(/\D/gi, '');
  inputEl.value = parsedVal;
  if (target === 'to') {
    selectedToMilage.value = parsedVal;
  } else if (target === 'from') {
    selectedFromMilage.value = parsedVal;
  }
  milageInputDebounce();
}
*/
function fromMilageSelected() {
  if ((selectedFromMilage.value || 0) > (selectedToMilage.value || 0)) {
    selectedToMilage.value = null;
  }
}

function fromYearSelected() {
  if ((selectedFromYear.value || 0) > (selectedToYear.value || 0)) {
    selectedToYear.value = null;
  }
}

function filterSearch() {
  const filterArray = prepareSearchQuery();
  router.push({ path: '/car-list', query: filterArray });
}

function boxSearch() {
  if (inlineSearchField.value) {
    router.push({
      path: '/car-list',
      query: { search: encodeURIComponent(inlineSearchField.value) },
    });
  }
}

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
  filterArray.page = encodeURIComponent(1);
  filterArray.search = encodeURIComponent('');

  return filterArray;
}

function generateForm(): Record<string, FormControlBase> {
  return reactive({
    regNumb: new FormControlBase('', 'Registreringsnummer', [isRegNoValid]),
    meterSett: new FormControlBase('', 'Mätarställning', [isMileageValid]),
    name: new FormControlBase('', 'Name', [isRequired]),
    phone: new FormControlBase('', 'Mobilnummer', [isSwedishPhoneNumberValid]),
    email: new FormControlBase('', 'email', [isEmailValid]),
  });
}

async function submitForm() {
  markDirtyAll(form);
  if (!checkFormErrors(form)) {
    const formData = new FormData();
    formData.append('registration_number', form.regNumb.field);
    formData.append('name', form.name.field);
    formData.append('telephone', form.phone.field);
    formData.append('mileage', form.meterSett.field);
    formData.append('email', form.email.field);
    loader.value = true;
    let response = null;
    try {
      response = await formSubmitHttp(
        `${config.public.API_BASE_URL}/dealership/${
          useShopId().value
        }/sell-car-request`,
        formData
      );
      response = JSON.parse(response as string);
    } catch (e) {
      console.error(e);
      response = null;
    }
    if (response && response?.code === 200) {
      toast({
        title: ' Säljbegäran',
        content: 'Säljförfrågan skickas framgångsrikt',
      });
      resetForm(form);
    } else if (response?.message) {
      const errorMap = {
        registration_number: form.regNumb,
        name: form.name,
        telephone: form.phone,
        mileage: form.meterSett,
        meterSett: form.email,
      } as Record<string, FormControlBase>;
      toast({
        title: ' Säljbegäran',
        content: response?.message,
      });
      if (response?.errors) {
        for (const key in response.errors) {
          if (errorMap[key]) {
            (response.errors[key] || []).forEach((err: any) => {
              errorMap[key].errors.push(err as string);
            });
          }
        }
      }
    } else {
      toast({
        title: ' Säljbegäran',
        content: 'Det gick inte att skicka försäljningsförfrågan',
      });
    }
    loader.value = false;
  }
}
</script>

<template>
  <div class="main-content" :style="cms?.backgroundImage">
    <div class="search-strip">
      <div class="container flex-center">
        <div class="search-box">
          <input
            v-model="inlineSearchField"
            type="text"
            @keydown.enter="boxSearch()"
          />
          <button class="btn btn-brand flex-center" @click="boxSearch()">
            <svgSearchIcon></svgSearchIcon>
          </button>
        </div>
      </div>
    </div>
    <div class="black-filter">
      <div class="container tag-line-box">
        <div class="tag-line-content">
          <div class="main-line">
            <div class="tag-main-title fw-extra-bold">
              {{ cms?.title }}
            </div>
            <div class="tag-line-art">
              <svgDoubleArrowIcon></svgDoubleArrowIcon>
              <svgDoubleArrowIcon></svgDoubleArrowIcon>
            </div>
          </div>
          <p class="tag-sub-title fw-semi-bold">
            {{ cms?.subtitle }}
          </p>
        </div>
      </div>
      <div class="container filter-box-wrapper">
        <div class="filter-box">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'SELL' }"
                @click="activeTab = 'SELL'"
                >SÄLJ DIN BIL</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'SEARCH' }"
                @click="activeTab = 'SEARCH'"
                >BILAR I LAGER</a
              >
            </li>
          </ul>
          <div v-if="activeTab === 'SELL'" class="filter-content-box">
            <ClientOnly>
              <div class="filter-grid">
                <div class="row filter-row">
                  <div class="col-sm-6 col-xs-12">
                    <input
                      v-model="form.regNumb.field"
                      type="text"
                      :class="{
                        'is-invalid': formError(form.regNumb),
                      }"
                      class="form-control line-component"
                      :placeholder="$t('Registration number')"
                      @blur="onBlur(form.regNumb)"
                      @input="onFieldChange(form.regNumb)"
                    />
                    <div
                      v-for="(error, index) in form.regNumb.errors"
                      :key="index"
                      class="invalid-feedback"
                    >
                      {{ error }}
                    </div>
                  </div>
                  <div class="col-sm-6 col-xs-12">
                    <input
                      v-model="form.meterSett.field"
                      :class="{
                        'is-invalid': formError(form.meterSett),
                      }"
                      type="text"
                      :max="999999"
                      class="form-control line-component"
                      :placeholder="$t('Meter setting')"
                      @blur="onBlur(form.meterSett)"
                      @input="onFieldChange(form.meterSett)"
                    />
                    <div
                      v-for="(error, index) in form.meterSett.errors"
                      :key="index"
                      class="invalid-feedback"
                    >
                      {{ error }}
                    </div>
                  </div>
                </div>
                <div class="row filter-row">
                  <div class="col-sm-6 col-xs-12">
                    <input
                      v-model="form.name.field"
                      :class="{
                        'is-invalid': formError(form.name),
                      }"
                      type="text"
                      class="form-control line-component"
                      :placeholder="$t('Name')"
                      @blur="onBlur(form.name)"
                      @input="onFieldChange(form.name)"
                    />
                    <div
                      v-for="(error, index) in form.name.errors"
                      :key="index"
                      class="invalid-feedback"
                    >
                      {{ error }}
                    </div>
                  </div>
                  <div class="col-sm-6 col-xs-12">
                    <input
                      v-model="form.phone.field"
                      :class="{
                        'is-invalid': formError(form.phone),
                        'is-valid': formValid(form.phone),
                      }"
                      type="text"
                      class="form-control line-component"
                      :placeholder="$t('Mobile number')"
                      @blur="onBlur(form.phone)"
                      @input="onFieldChange(form.phone)"
                    />
                    <div
                      v-for="(error, index) in form.phone.errors"
                      :key="index"
                      class="invalid-feedback"
                    >
                      {{ error }}
                    </div>
                  </div>
                </div>
                <div class="row filter-row">
                  <div class="col-sm-12 col-xs-12">
                    <input
                      v-model="form.email.field"
                      :class="{
                        'is-invalid': formError(form.email),
                        'is-valid': formValid(form.email),
                      }"
                      type="text"
                      class="form-control line-component"
                      :placeholder="$t('E-mail address')"
                      @blur="onBlur(form.email)"
                      @input="onFieldChange(form.email)"
                    />
                    <div
                      v-for="(error, index) in form.email.errors"
                      :key="index"
                      class="invalid-feedback"
                    >
                      {{ error }}
                    </div>
                  </div>
                </div>
              </div>
              <button
                class="btn btn-brand custom-btn form-submit"
                :disabled="loader"
                @click="submitForm()"
              >
                <span
                  v-if="loader"
                  class="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span>{{ $t('Send') }}</span>
              </button>
            </ClientOnly>
          </div>
          <div v-if="activeTab === 'SEARCH'" class="filter-content-box">
            <div class="filter-grid">
              <div class="row filter-row">
                <ClientOnly>
                  <div class="col-lg-3 col-sm-6 col-xs-12">
                    <v-select
                      v-model="selectedChassis"
                      :allow-empty="true"
                      :multiple="true"
                      class="filter-option"
                      :placeholder="$t('Chassis')"
                      select-label=""
                      deselect-label=""
                      selected-label="✓"
                      :options="chassisList"
                    ></v-select>
                  </div>
                  <div class="col-lg-3 col-sm-6 col-xs-12">
                    <v-select
                      v-model="selectedBrand"
                      :allow-empty="true"
                      class="filter-option"
                      :placeholder="$t('Brands')"
                      select-label=""
                      deselect-label=""
                      selected-label="✓"
                      :options="brandList"
                      @select="brandSelected()"
                    ></v-select>
                  </div>
                  <div class="col-lg-6 col-sm-12 col-xs-12">
                    <v-select
                      v-model="selectedModel"
                      :allow-empty="true"
                      :disabled="!selectedBrand"
                      :multiple="true"
                      class="filter-option"
                      :placeholder="$t('Model')"
                      select-label=""
                      deselect-label=""
                      selected-label="✓"
                      :options="modelList"
                    ></v-select>
                  </div>
                </ClientOnly>
              </div>
              <div class="row filter-row">
                <div class="col-lg-3 col-sm-6 col-xs-12">
                  <v-select
                    v-model="selectedFromYear"
                    :allow-empty="true"
                    class="filter-option"
                    :placeholder="$t('Year model from')"
                    select-label=""
                    deselect-label=""
                    selected-label="✓"
                    :options="fromYearList"
                    @select="fromYearSelected()"
                  ></v-select>
                </div>
                <div class="col-lg-3 col-sm-6 col-xs-12">
                  <v-select
                    v-model="selectedToYear"
                    :allow-empty="true"
                    class="filter-option"
                    :placeholder="$t('Year model to')"
                    select-label=""
                    deselect-label=""
                    selected-label="✓"
                    :options="toYearList"
                  ></v-select>
                </div>
                <div class="col-lg-3 col-sm-6 col-xs-12">
                  <v-select
                    v-model="selectedFromMilage"
                    :allow-empty="true"
                    class="filter-option"
                    :placeholder="$t('Milage from')"
                    select-label=""
                    deselect-label=""
                    selected-label="✓"
                    :options="fromMilageList"
                    @select="fromMilageSelected()"
                  ></v-select>
                </div>
                <div class="col-lg-3 col-sm-6 col-xs-12">
                  <v-select
                    v-model="selectedToMilage"
                    :allow-empty="true"
                    class="filter-option"
                    :placeholder="$t('Milage to')"
                    select-label=""
                    deselect-label=""
                    selected-label="✓"
                    :options="toMilageList"
                  ></v-select>
                </div>
              </div>
            </div>
            <button class="btn btn-brand upper-case" @click="filterSearch()">
              {{ $t('SEARCH') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
input.form-field-adjustment {
  height: 40px !important;

  &::placeholder {
    color: #adadad;
  }
}
.form-submit {
  margin-top: 10px;
}
.line-label {
  display: none !important;
}
.line-component.form-control {
  border: none;
  margin: 5px;
  padding: 0px;
  border-bottom: 1px solid #adadad;
  border-radius: 0;
  box-shadow: none;
  outline: none;
  height: 40px;
  &.is-invalid {
    border-color: var(--bs-danger) !important;
  }
  &.is-valid {
    border-color: var(--bs-success) !important;
  }
  &::placeholder {
    color: #adadad;
    font-size: 14px;
    text-transform: capitalize;
  }
}
.invalid-feedback {
  padding-left: 5px;
  margin-top: 6px;
}
</style>
