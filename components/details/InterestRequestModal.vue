<script setup lang="ts">
import svgModalClose from '@/assets/svg/sell-model/close.svg';
import {
  isSwedishPhoneNumberValid,
  isEmailValid,
  isRequired,
  isMessageBoxValid,
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
import { CarDetails, EnquiryType } from '@/models/car-details';

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const { t } = useI18n();
const carInfo = reactive({} as CarDetails);
const popupElement = ref(null);
let modal: any = null;
const form = generateForm();
const carId = ref('');
const enquiryType: Ref<EnquiryType> = ref(EnquiryType.talk);

const loader = ref(false);

nuxtApp.$bus.$on(
  'openTalkToSalePersonPopup',
  (payload: { carId: string; carInfo: CarDetails; queryType: EnquiryType }) => {
    enquiryType.value = payload.queryType;
    carId.value = payload.carId;
    for (const key in payload.carInfo) {
      carInfo[key] = payload.carInfo[key];
    }
    if (modal && modal.hide) {
      modal.hide();
    }
    modal = new nuxtApp.$bootstrap.Modal(popupElement.value, {
      keyboard: true,
    });
    modal.show();
    resetForm(form);
    loader.value = false;
  }
);

onBeforeMount(() => {
  close();
});

function close() {
  if (modal && modal.hide) {
    modal.hide();
  }
}

function generateForm() {
  return reactive({
    name: new FormControlBase('', t('Name'), [isRequired]),
    phone: new FormControlBase('', t('Phone'), [isSwedishPhoneNumberValid]),
    email: new FormControlBase('', t('Email'), [isEmailValid]),
    communication: new FormControlBase('', t('Communication Preference'), [
      isRequired,
    ]),
    message: new FormControlBase('', t('Message'), [isMessageBoxValid]),
    tradeInCar: new FormControlBase<boolean>(false, t('Trade in car'), [], {
      resetValue: false,
    }),
    needFinancing: new FormControlBase<boolean>(
      false,
      t('Need Financing'),
      [],
      {
        resetValue: false,
      }
    ),
  });
}

async function submitForm() {
  markDirtyAll(form);
  if (!checkFormErrors(form)) {
    const formData = new FormData();

    formData.append('name', form.name.field);
    formData.append('telephone', form.phone.field);
    formData.append('email', form.email.field);

    formData.append('request_type', enquiryType.value);
    formData.append('communication_preference', form.communication.field);
    formData.append('message', form.message.field);
    formData.append('trade_in_car', form.tradeInCar.field + '');
    formData.append('need_financing', form.needFinancing.field + '');

    loader.value = true;
    let response = null;

    const url = `${config.public.API_BASE_URL}/dealership/${
      useShopId().value
    }/cars/${carId.value}/show-interest`;
    try {
      response = await formSubmitHttp(url, formData);
      response = JSON.parse(response as string);
    } catch (e) {
      console.error(e);
      response = null;
    }
    const title = getToastMessagesBasedOnType(enquiryType.value);
    if (response && response?.code === 200) {
      toast({
        title,
        content: t(
          'The request has been successfully sent and we will contact you shortly'
        ),
      });
    } else if (response?.message) {
      toast({
        title,
        content: response?.message,
      });
    } else {
      toast({
        title,
        content: t('Failed to send request, please try again later'),
      });
    }
    close();
    loader.value = true;
  }
}
function getToastMessagesBasedOnType(type: EnquiryType): string {
  if (type === EnquiryType.reserve) {
    return t('Reserve the car');
  } else if (type === EnquiryType.talk) {
    return t('Talk to a salesperson');
  }
  return '';
}
</script>

<template>
  <div
    ref="popupElement"
    class="modal fade custom-modal request-modal"
    tabindex="-1"
    role="dialog"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <span v-if="enquiryType === EnquiryType.talk">{{
              $t('Talk to a salesperson')
            }}</span>
            <span v-if="enquiryType === EnquiryType.reserve">{{
              $t('Reserve the car')
            }}</span>
          </h5>
          <button
            type="button"
            class="close btn btn-link"
            aria-label="Close"
            @click="close()"
          >
            <svgModalClose></svgModalClose>
          </button>
        </div>
        <div class="modal-body">
          <div class="car-detail-section">
            <div class="row">
              <div class="col-md-6">
                <div class="car-image-section">
                  <img class="img-fluid" :src="carInfo.thumbnail" alt="" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="rt-contents">
                  <div class="single-block">
                    <div class="main-title-block">
                      <span class="model-name">
                        <span class="me-1">{{ carInfo?.carData?.model }}</span
                        ><span class="fw-regular">|</span>
                      </span>
                      <span class="mfd-name">
                        {{ carInfo?.carData?.brand }}</span
                      >
                    </div>
                    <div class="main-model-desc">
                      {{ carInfo?.description }}
                    </div>
                  </div>
                  <div class="pricing-section">
                    <h2>{{ carInfo?.formattedPrice }}</h2>
                    <span class="admin-charges d-none"
                      >+ administrationsavgift 995 kr</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="contact-details-form">
            <div class="inner-heading">
              {{ $t('Contact details') }}
            </div>
            <div class="form-area">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">{{ $t('NAME') }} *</label>
                  <input
                    v-model="form.name.field"
                    :class="{
                      'is-invalid': formError(form.name),
                    }"
                    type="text"
                    class="form-control"
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
                <div class="col-md-6">
                  <label class="form-label upper-case"
                    >{{ $t('phone') }} *</label
                  >
                  <input
                    v-model="form.phone.field"
                    :class="{
                      'is-invalid': formError(form.phone),
                      'is-valid': formValid(form.phone),
                    }"
                    type="text"
                    class="form-control"
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
                <div class="col-md-12">
                  <label class="form-label">{{ $t('E-POST') }} *</label>
                  <input
                    v-model="form.email.field"
                    :class="{
                      'is-invalid': formError(form.email),
                      'is-valid': formValid(form.email),
                    }"
                    type="text"
                    class="form-control"
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
                <div class="col-md-12">
                  <label class="form-label"
                    >{{ $t('Preferred way of contact') }} *</label
                  >
                  <div class="radio-section">
                    <div class="form-check">
                      <label class="form-check-label">
                        <input
                          v-model="form.communication.field"
                          class="form-check-input me-1"
                          type="radio"
                          value="email"
                          @blur="onBlur(form.communication)"
                          @change="onFieldChange(form.communication)"
                        />
                        <span>{{ $t('Email') }}</span>
                      </label>
                    </div>
                    <div class="form-check">
                      <label class="form-check-label">
                        <input
                          v-model="form.communication.field"
                          class="form-check-input me-1"
                          type="radio"
                          value="phone"
                          @blur="onBlur(form.communication)"
                          @change="onFieldChange(form.communication)"
                        />
                        <span class="capitalize">{{ $t('phone') }}</span>
                      </label>
                    </div>
                  </div>
                  <div
                    v-for="(error, index) in form.communication.errors"
                    :key="index"
                    :class="{
                      'd-block': formError(form.communication),
                    }"
                    class="invalid-feedback"
                  >
                    {{ error }}
                  </div>
                </div>
                <div class="col-md-12">
                  <label class="form-label message-label">
                    <span>{{ $t('Message') }}</span>
                    <span class="counter"
                      >{{ form.message.field.length }}/1000</span
                    >
                  </label>
                  <textarea
                    v-model="form.message.field"
                    :class="{
                      'is-invalid': formError(form.message),
                    }"
                    class="form-control"
                    maxlength="1000"
                    @blur="onBlur(form.message)"
                    @input="onFieldChange(form.message)"
                  ></textarea>
                  <div
                    v-for="(error, index) in form.message.errors"
                    :key="index"
                    class="invalid-feedback"
                  >
                    {{ error }}
                  </div>
                  <div class="ckeck-box-area">
                    <div class="form-check">
                      <label class="form-check-label">
                        <input
                          v-model="form.tradeInCar.field"
                          class="form-check-input me-1"
                          type="checkbox"
                        />
                        <span>{{ $t('I have a trade-in car') }}</span>
                      </label>
                    </div>
                    <div class="form-check">
                      <label class="form-check-label">
                        <input
                          v-model="form.needFinancing.field"
                          class="form-check-input me-1"
                          type="checkbox"
                        />
                        <span> {{ $t('I am interested in financing') }}</span>
                      </label>
                    </div>
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message-label {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .counter {
    font-size: 12px;
    color: var(--bs-gray-600);
    margin-right: 5px;
  }
}
</style>
