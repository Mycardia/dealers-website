<script setup lang="ts">
import moment from 'moment';
import _ from 'lodash';
import svgSliderNext from '@/assets/svg/details-page/slider-next.svg';
import svgSliderPrev from '@/assets/svg/details-page/slider-prev.svg';
import svgVerified from '@/assets/svg/review/verified.svg';
import svgRatingStar from '@/assets/svg/rating-star.svg';

import type { ReviewItem } from '@/models/review';

const props = defineProps({
  additionalTopMargin: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const activePage = ref(1);
const config = useRuntimeConfig();
const oldPage = ref(0);
const loader = ref(false);
const sliderWrapper = ref(null);
const pagination: number[] = reactive([]);
const reviewVectorList: ReviewItem[] = reactive([]);
const reviewPageList: ReviewItem[][] = reactive([]);
const ratingStar = reactive(generateArrayFromNum(5));

const observerList: Record<string, ResizeObserver> = {};

let lastKnownWidth = 0;
let perPage = 3;

async function fetchReview() {
  loader.value = true;
  let response: any = null;
  try {
    response = await $fetch(
      `${config.public.API_BASE_URL}/dealership/${
        useShopId().value
      }/published-reviews`
    );
  } catch (e) {
    console.error(e);
    response = null;
  }
  if (response && response.code === 200) {
    processReviewDetails(response.result);
  }
  loader.value = false;
}

function processReviewDetails(data: any[]) {
  reviewVectorList.splice(0);
  data.forEach((_review: ReviewItem) => {
    _review.contentBox = { clientHeight: 2, scrollHeight: 1, showMore: false };
    _review.descriptionHTML = formatHtml(_review.description || '');
    _review.formattedDate = moment(_review.created_at).format('DD MMMM yyyy');
    if (reviewVectorList.length <= 120) {
      reviewVectorList.push(_review as ReviewItem);
    }
  });

  nextTick(() => {
    setTimeout(() => {
      calculatePerPage();
    }, 200);
  });
}

function pageChange(newPage: number) {
  oldPage.value = activePage.value;
  activePage.value = newPage;
}

onMounted(() => {
  fetchReview();
  calculatePerPage();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const handleResize = () => {
  const elWidth = (sliderWrapper.value as any)?.offsetWidth || 0;
  if (lastKnownWidth !== elWidth) {
    calculatePerPage(elWidth);
  }
};
function calculatePerPage(elWidth?: number) {
  if (!elWidth) {
    elWidth = ((sliderWrapper.value as any)?.offsetWidth || 0) as number;
  }
  if (elWidth > 0) {
    lastKnownWidth = elWidth;
    if (elWidth < 768) {
      perPage = 1;
    } else if (elWidth < 1200 && elWidth >= 768) {
      perPage = 2;
    } else if (elWidth >= 1200) {
      perPage = 3;
    }
  }
  calculatePagination();
}

function calculatePagination() {
  pagination.splice(0);
  reviewPageList.splice(0);
  activePage.value = 1;
  oldPage.value = 0;
  let currentPage = 0;
  let currentItemInPage = 0;
  for (let index = 0; index < reviewVectorList.length; index++) {
    if (currentItemInPage >= perPage) {
      currentItemInPage = 0;
      currentPage++;
    }
    if (!reviewPageList[currentPage]) {
      reviewPageList[currentPage] = [];
    }
    reviewPageList[currentPage].push(reviewVectorList[index]);
    currentItemInPage++;
  }
  const limit = Math.max(1, Math.ceil(reviewVectorList.length / perPage));
  generateArrayFromNum(limit, pagination);
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

function formatHtml(description: string) {
  const contentArray: string[] = [];
  ((description || '').split('\n') || []).forEach((lineData: string) => {
    const line = lineData.trim();
    if (line) {
      contentArray.push(`<p>${_.escape(line)}</p>`);
    }
  });
  return contentArray.join('');
}

function updateContentBoxVal(el: HTMLElement, reviewItem: ReviewItem) {
  const rc = el.querySelector('.review-content') as HTMLElement;
  reviewItem.contentBox.clientHeight = el.clientHeight;
  if (rc?.clientHeight) {
    reviewItem.contentBox.scrollHeight = rc.clientHeight + 30;
  } else {
    reviewItem.contentBox.scrollHeight = el.clientHeight;
  }
}

function calculateElHeight(review: ReviewItem) {
  return {};
  // if (review.contentBox.showMore) {
  //   return { height: review.contentBox.scrollHeight + 'px' };
  // } else {
  //   return { height: 'initial' };
  // }
}

function centralAlign(review: ReviewItem) {
  return false;
  // return review.contentBox.clientHeight - review.contentBox.scrollHeight > 10;
}

const vShowMore = {
  mounted(el: HTMLElement, binding: any) {
    updateContentBoxVal(el, binding.value);
    observerList[binding.value.id] = new ResizeObserver((entries) => {
      const target = entries[0]?.target;
      if (target) {
        updateContentBoxVal(target as HTMLElement, binding.value);
      }
    });
    observerList[binding.value.id].observe(el);
  },
  unmounted(el: HTMLElement, binding: any) {
    observerList[binding.value.id].unobserve(el);
    delete observerList[binding.value.id];
  },
};

/*
  <div
                v-if="
                  review.contentBox.showMore ||
                  review.contentBox.scrollHeight >
                    review.contentBox.clientHeight
                "
                class="show-more-section"
                @click="
                  review.contentBox.showMore = !review.contentBox.showMore
                "
              >
                <span
                  class="expand-btn"
                  :class="{ 'show-less': review.contentBox.showMore }"
                >
                  <span v-if="!review.contentBox.showMore" class="exb-text"
                    >Visa mer</span
                  >
                  <span v-if="review.contentBox.showMore" class="exb-text"
                    >Visa mindre</span
                  >
                  <svgShowMore></svgShowMore>
                </span>
              </div>
 */
</script>

<template>
  <div
    v-if="reviewVectorList.length"
    :class="{ 'extra-top-padding': props.additionalTopMargin }"
    class="happy-customer container-fluid"
  >
    <h1 class="heading-main">
      {{ $t('our happy customers') }}
    </h1>
    <div ref="sliderWrapper" class="customer-block-wrapper">
      <template v-for="(page, index) in reviewPageList" :key="index">
        <Transition :name="oldPage < activePage ? 'slide-right' : 'slide-left'">
          <div v-if="activePage === index + 1" class="customer-block">
            <div
              v-for="review in page"
              :key="review.id"
              class="customer-item"
              :class="{ 'show-more-mode': review.contentBox.showMore }"
            >
              <h2 class="review-title">
                {{ review.title }}
              </h2>
              <hr class="divide-line" />
              <div
                class="review-description"
                :class="{
                  'center-align': centralAlign(review),
                }"
                :style="calculateElHeight(review)"
                v-html="review.descriptionHTML"
              ></div>
              <!-- <div
                  class="review-content"
                ></div> -->
              <!-- See code in script block -->

              <div class="review-by">
                <span class="customer-name"> {{ review.name }}</span>
                <span class="review-date"> {{ review.formattedDate }}</span>
              </div>
              <div class="footer-items">
                <div class="footer-wrap">
                  <div class="rating-box">
                    <svgRatingStar
                      v-for="count in ratingStar"
                      :key="count"
                      class="rating-star"
                      :class="{ marked: count <= review.rating }"
                    ></svgRatingStar>
                  </div>
                  <div class="verified-box">
                    <svgVerified class="verified-icon"></svgVerified>
                    <span class="verified-text">Bank-ID verifierat</span>
                  </div>
                </div>
                <div class="badge-holder">
                  <img
                    class="trust-badge"
                    src="/image/cardia-trust-badge.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </template>
    </div>
    <div class="slider-nav">
      <div
        v-for="pageNumber in pagination"
        :key="pageNumber"
        class="point"
        :class="{ active: pageNumber === activePage }"
        @click="pageChange(pageNumber)"
      ></div>
    </div>
    <div class="slider-nav-sm" v-if="reviewPageList.length > 1">
      <div class="slider-button-group">
        <button
          class="btn btn-brand slider-button"
          :disabled="activePage === 1"
          @click="pageChange(activePage - 1)"
        >
          <svgSliderPrev></svgSliderPrev>
        </button>
        <button
          class="btn btn-brand slider-button"
          :disabled="activePage === pagination.length"
          @click="pageChange(activePage + 1)"
        >
          <svgSliderNext></svgSliderNext>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.extra-top-padding {
  padding-top: 60px;
}

.slide-left-enter-active,
.slide-right-enter-active {
  transition-delay: 400s;
}

.slide-left-enter-active,
.slide-right-enter-active,
.slide-left-leave-active,
.slide-right-leave-active {
  transition: all 400ms cubic-bezier(1, 0.5, 0.8, 1);
  position: absolute !important;
}

.slide-left-enter-from,
.slide-left-leave-to,
.slide-right-enter-from,
.slide-right-leave-to {
  opacity: 0;
}
.slide-left-enter-from,
.slide-right-leave-to {
  transform: translateX(-100%);
}
.slide-right-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
}
</style>
