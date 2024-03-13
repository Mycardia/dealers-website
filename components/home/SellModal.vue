<script setup lang="ts">
import svgModalClose from '@/assets/svg/sell-model/close.svg';
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

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const router = useRouter();

const popupElement = ref(null);
let modal: any = null;
const form: Record<string, FormControlBase> = generateForm();

const loader = ref(false);

const modalVisible = () => {
  const urlParams = new URLSearchParams(location.search);
  if (!(urlParams.has('sell') && urlParams.get('sell') === '1')) {
    urlParams.set('sell', '1');
  }
  updateUrl(urlParams.entries());
};
const modalHidden = () => {
  const urlParams = new URLSearchParams(location.search);
  urlParams.delete('sell');
  updateUrl(urlParams.entries());
};

function updateUrl(entries: IterableIterator<[string, string]>) {
  const result: any = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  router.replace({ query: result });
}

function paramChanges() {
  const urlParams = new URLSearchParams(location.search);
  if (urlParams.has('sell') && urlParams.get('sell') === '1') {
    if (modal && modal.show) {
      modal.show();
    }
  }
}

nuxtApp.$bus.$on('openSellPopUp', () => {
  if (modal && modal.hide) {
    modal.hide();
  }
  modal.show();
  resetForm(form);
  loader.value = false;
});

onMounted(() => {
  modal = new nuxtApp.$bootstrap.Modal(popupElement.value, {
    keyboard: true,
  });
  (modal._element as HTMLElement).addEventListener(
    'hidden.bs.modal',
    modalHidden
  );
  (modal._element as HTMLElement).addEventListener(
    'shown.bs.modal',
    modalVisible
  );
  paramChanges();
});

onBeforeUnmount(() => {
  close();
  if (modal && modal._element) {
    (modal._element as HTMLElement).removeEventListener(
      'hidden.bs.modal',
      modalHidden
    );
    (modal._element as HTMLElement).removeEventListener(
      'shown.bs.modal',
      modalVisible
    );
  }
});

function close() {
  if (modal && modal.hide) {
    modal.hide();
  }
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
    } else if (response?.message) {
      toast({
        title: ' Säljbegäran',
        content: response?.message,
      });
    } else {
      toast({
        title: ' Säljbegäran',
        content: 'Det gick inte att skicka försäljningsförfrågan',
      });
    }
    close();
    loader.value = true;
  }
}
</script>

<template>
  <div
    ref="popupElement"
    class="modal fade custom-modal"
    tabindex="-1"
    role="dialog"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ $t('Sell your car') }}
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
          <div class="inner-heading">
            {{ $t('Information about the car') }}
          </div>
          <div class="form-area">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label"
                  >{{ $t('Registration number') }} *</label
                >
                <input
                  v-model="form.regNumb.field"
                  type="text"
                  :class="{
                    'is-invalid': formError(form.regNumb),
                  }"
                  class="form-control"
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
              <div class="col-md-6">
                <label class="form-label">{{ $t('Meter setting') }} *</label>
                <input
                  v-model="form.meterSett.field"
                  :class="{
                    'is-invalid': formError(form.meterSett),
                  }"
                  type="text"
                  :max="999999"
                  class="form-control"
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
                <label class="form-label">{{ $t('Mobile number') }} *</label>
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
              <div class="col-12">
                <label class="form-label">{{ $t('E-MAIL') }} *</label>
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
</template>

<style lang="scss"></style>
