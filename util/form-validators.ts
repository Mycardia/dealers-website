import { ValidatorFunction } from '@/models/form';
import { FormControlBase } from '@/util/form-control';

export const isRequired: ValidatorFunction = (formControl: FormControlBase) => {
  let val = formControl.field;
  val = (`${val}` || '').trim();
  if (!val) {
    formControl.errors.push(`Fält ${formControl.name} krävs`);
  }
};
export const isMessageBoxValid: ValidatorFunction = (
  formControl: FormControlBase
) => {
  let val = formControl.field;
  const maxLimit = 1000;
  val = (`${val}` || '').trim();
  if (!val) {
    formControl.errors.push(`Fält ${formControl.name} krävs`);
  }
  if (val.length > maxLimit) {
    formControl.errors.push(
      `${formControl.name} innehåll bör vara mindre än ${maxLimit} tecken`
    );
  }
};

export const isRequiredByCharLimit = (minLimit: number, maxLimit: number) => {
  const validator: ValidatorFunction = (formControl: FormControlBase) => {
    let val = formControl.field;
    val = (`${val}` || '').trim();
    if (!val) {
      formControl.errors.push(`Fält ${formControl.name} krävs`);
    } else if (val.length < minLimit) {
      formControl.errors.push(
        `${formControl.name} innehåll bör vara minst  ${minLimit} tecken`
      );
    } else if (val.length > maxLimit) {
      formControl.errors.push(
        `${formControl.name} innehåll får inte vara mer än ${maxLimit} tecken`
      );
    }
  };
  return validator;
};

export const isRegNoValid: ValidatorFunction = (
  formControl: FormControlBase
) => {
  const swedishRegNoRegx = /[A-Za-z]{3}[0-9]{2}[A-Za-z0-9]{1}/;
  let val = formControl.field;
  val = (`${val}` || '').trim();
  if (!swedishRegNoRegx.test(val)) {
    formControl.errors.push('Ange ett giltigt registreringsnummer');
  }
};

export const isMileageValid: ValidatorFunction = (
  formControl: FormControlBase
) => {
  const numberRegx = /^\d+$/;
  let val = formControl.field;
  val = (`${val}` || '').trim();
  if (!numberRegx.test(val)) {
    formControl.errors.push(`Fält ${formControl.name} krävs`);
  }

  const intVal = parseInt(val);
  if (intVal > 999999) {
    formControl.errors.push('Miltal får inte vara större än 999999');
  }
};

export const isSwedishPhoneNumberValid: ValidatorFunction = (
  formControl: FormControlBase
) => {
  const swedishPhoneRegx = /^\+?0{0,2}?(\s|-)?(\d{2,3}(\s|-)?){3,4}$/;
  let val = formControl.field;
  val = (`${val}` || '').trim();
  if (!swedishPhoneRegx.test(val)) {
    formControl.errors.push('Ange ett giltigt telefonnummer');
  }
};

export const isEmailValid: ValidatorFunction = (
  formControl: FormControlBase
) => {
  const emailRegx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let val = formControl.field;
  val = (`${val}` || '').trim();
  if (!emailRegx.test(val)) {
    formControl.errors.push('Var god ange en giltig e-postadress');
  }
};

export const isOptionalEmailValid: ValidatorFunction = (
  formControl: FormControlBase
) => {
  const emailRegx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let val = formControl.field;
  val = (`${val}` || '').trim();
  if (val !== '' && !emailRegx.test(val)) {
    formControl.errors.push('Var god ange en giltig e-postadress');
  }
};

export const isRatingValid: ValidatorFunction = (
  formControl: FormControlBase
) => {
  const val = formControl.field + '';
  if (val === '0') {
    formControl.errors.push(`Fält ${formControl.name} krävs`);
  }
};
