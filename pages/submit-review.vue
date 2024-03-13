<script setup lang="ts">
import svgDoubleArrowIcon from '@/assets/svg/double-arrow.svg';
import { usePageDataStore } from '@/store/page-data-store';

import {
  isRequiredByCharLimit,
  isOptionalEmailValid,
  isRequired,
  isRatingValid,
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
} from '@/util/form-control';

const config = useRuntimeConfig();
const loader = ref(false);
const router = useRouter();
const showLineError = ref(false);

const form: Record<string, FormControlBase<any>> = generateForm();

const { aboutUsData } = usePageDataStore();

const ratingStar = reactive(generateArrayFromNum(5));

const suggestedRating = ref(1);
const isHover = ref(false);
const availableTitle = reactive(['Jag sålde min bil', 'Jag köpte min bil']);

function generateForm(): Record<string, FormControlBase<any>> {
  return reactive({
    title: new FormControlBase('', 'Titel', [isRequired]),
    description: new FormControlBase('', 'Skriftlig recension', [
      isRequiredByCharLimit(10, 300),
    ]),
    name: new FormControlBase('', 'Namn', [isRequiredByCharLimit(2, 100)]),
    rating: new FormControlBase<number>(0, 'Stjärnbetyg', [isRatingValid]),
  });
}

async function submitForm() {
  markDirtyAll(form);
  if (!checkFormErrors(form)) {
    const formData = new FormData();
    formData.append('title', form.title.field);
    formData.append('name', form.name.field);
    formData.append('description', form.description.field);
    formData.append('rating', form.rating.field);
    loader.value = true;
    let response = null;
    try {
      response = await formSubmitHttp(
        `${config.public.API_BASE_URL}/dealership/${
          useShopId().value
        }/post-review`,
        formData
      );
      response = JSON.parse(response as string);
    } catch (e) {
      console.error(e);
      response = null;
    }
    if (response && response?.code === 200) {
      toast({
        title: ' Recension',
        content: 'Granskningen har skickats',
      });
    } else if (response?.message) {
      toast({
        title: ' Recension',
        content: response?.message,
      });
    } else {
      toast({
        title: ' Recension',
        content: 'Det gick inte att skicka recensionen',
      });
    }
    router.replace('/');
    loader.value = false;
  }
}

function generateArrayFromNum(len: number, target?: number[]) {
  const arr: number[] = [];
  for (let x = 1; x <= len; x++) {
    arr.push(x);
    if (target) {
      target.push(x);
    }
  }
  return arr;
}

function restrictNewLines() {
  const newLineRegExp = /\n/gim;
  const doubleSpaceRegExp = /\s{2,}/gim;
  const strArr = form.description.field.split('');
  const result = form.description.field.matchAll(newLineRegExp);
  showLineError.value = false;
  [...result].forEach((res, index) => {
    if (index >= 1) {
      strArr[res.index] = ' ';
      showLineError.value = true;
    }
  });
  form.description.field = strArr.join('').replace(doubleSpaceRegExp, ' ');
}
</script>
<template>
  <HomeAppHeader></HomeAppHeader>
  <main class="grey-bg header-spacing">
    <div class="inner-banner" :style="aboutUsData?.backgroundImage">
      <div class="overlay">
        <div class="container">
          <div class="banner-text">
            <div class="main-caption">Skicka recension</div>
            <div class="tag-line-art">
              <svgDoubleArrowIcon></svgDoubleArrowIcon>
              <svgDoubleArrowIcon></svgDoubleArrowIcon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="about-blocks submit-review-block">
        <div class="card single-custom-card">
          <h3 class="card-title">Lägg upp din recension</h3>
          <div>
            <p>
              Dela gärna din recension av vår återförsäljare. Din värdefulla
              feedback hjälper oss att förbättra och tillhandahålla de bästa
              tjänsterna. Vi uppskattar din feedback och tackar för din tid.
            </p>
          </div>
          <div class="form-area">
            <div class="row g-3">
              <div class="col-md-12">
                <div class="review-selector">
                  <label class="form-label">Stjärnbetyg *</label>
                  <div class="star-section-wrapper">
                    <div
                      class="star-section"
                      @mouseenter="isHover = true"
                      @mouseleave="isHover = false"
                    >
                      <div
                        v-for="count in ratingStar"
                        :key="count"
                        :class="{
                          selected:
                            (count <= form.rating.field && !isHover) ||
                            (count <= suggestedRating && isHover),
                        }"
                        class="single-star"
                        @click="form.rating.field = count"
                        @mouseenter="suggestedRating = count"
                      >
                        <svg
                          class=""
                          xmlns="http://www.w3.org/2000/svg"
                          width="63.806"
                          height="61.141"
                          viewBox="0 0 63.806 61.141"
                        >
                          <g class="star" transform="translate(0.534 0.5)">
                            <path
                              d="M28,2.09,20.347,17.628l-17.133,2.5a3.758,3.758,0,0,0-2.076,6.408l12.4,12.088L10.6,55.7a3.751,3.751,0,0,0,5.441,3.955L31.37,51.59,46.7,59.653A3.754,3.754,0,0,0,52.138,55.7L49.206,38.623,61.6,26.535a3.758,3.758,0,0,0-2.076-6.408l-17.133-2.5L34.735,2.09A3.755,3.755,0,0,0,28,2.09Z"
                              transform="translate(-0.001 0.001)"
                              stroke-width="1"
                            />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div
                    v-for="(error, index) in form.rating.errors"
                    :key="index"
                    class="invalid-feedback d-block"
                  >
                    {{ error }}
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <label class="form-label">Titel *</label>
                <v-select
                  v-model="form.title.field"
                  :allow-empty="true"
                  :multiple="false"
                  class="title-select"
                  placeholder=""
                  select-label=""
                  deselect-label=""
                  selected-label="✓"
                  :searchable="false"
                  :options="availableTitle"
                  :class="{
                    'is-invalid': formError(form.title),
                  }"
                  @select="onFieldChange(form.title)"
                ></v-select>
                <div
                  v-for="(error, index) in form.title.errors"
                  :key="index"
                  class="invalid-feedback"
                >
                  {{ error }}
                </div>
              </div>
              <div class="col-md-12">
                <label class="form-label">Skriftlig recension *</label>
                <textarea
                  v-model="form.description.field"
                  maxlength="1000"
                  class="form-control"
                  :class="{
                    'is-invalid': formError(form.description),
                  }"
                  @blur="onBlur(form.description)"
                  @input="
                    restrictNewLines();
                    onFieldChange(form.description);
                  "
                ></textarea>
                <div
                  v-for="(error, index) in form.description.errors"
                  :key="index"
                  class="invalid-feedback"
                >
                  {{ error }}
                </div>
                <div v-if="showLineError" class="invalid-feedback d-block">
                  Endast ett stycke stöds i recensionen
                </div>
              </div>
              <div class="col-md-12">
                <label class="form-label">Ditt namn *</label>
                <input
                  v-model="form.name.field"
                  maxlength="200"
                  type="text"
                  class="form-control"
                  :class="{
                    'is-invalid': formError(form.name),
                  }"
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
              <div class="col-12 btn-cover-modal">
                <button
                  class="btn btn-brand custom-btn"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <HomeAppFooter></HomeAppFooter>
</template>
<style lang="scss"></style>
