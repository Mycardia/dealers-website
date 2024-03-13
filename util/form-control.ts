import {
  ValidatorFunction,
  FormControlType,
  FormDataType,
  FormConfig,
} from '@/models/form';

export class FormControlBase<T = string> {
  field: T;
  resetValue: any;
  name = '';
  isDirty = false;
  isTouched = false;
  dataType = FormDataType.String;
  elType = FormControlType.Textbox;
  errors: string[] = [];
  validator: ValidatorFunction[] = [];
  constructor(
    initialValue: T,
    name: string,
    validator: ValidatorFunction[],
    config?: FormConfig
  ) {
    this.field = initialValue;
    this.name = name;
    this.validator = validator;
    this.dataType = config?.dataType || FormDataType.String;
    this.elType = config?.elType || FormControlType.Textbox;
    this.resetValue = Object.hasOwn(config || {}, 'resetValue')
      ? config?.resetValue
      : '';
  }
}
export const onFieldChange = (formControl: FormControlBase<any>) => {
  formControl.isDirty = true;
  validate(formControl);
};
export const onBlur = (formControl: FormControlBase<any>) => {
  formControl.isTouched = true;
};
export const validate = (formControl: FormControlBase<any>) => {
  formControl.errors.splice(0);
  formControl.validator.forEach((valFn: ValidatorFunction) => {
    valFn(formControl);
  });
};
export const validateAll = (
  formControlObject: Record<string, FormControlBase<any>>
) => {
  for (const key in formControlObject) {
    validate(formControlObject[key]);
  }
};

export const resetForm = (
  formControlObject: Record<string, FormControlBase<any>>
) => {
  for (const key in formControlObject) {
    formControlObject[key].field = formControlObject[key].resetValue;
    formControlObject[key].isDirty = false;
    formControlObject[key].isTouched = false;
    formControlObject[key].errors.splice(0);
  }
};

export const checkFormErrors = (
  formControlObject: Record<string, FormControlBase<any>>
) => {
  validateAll(formControlObject);
  for (const key in formControlObject) {
    if (formControlObject[key].errors.length) {
      return true;
    }
  }
  return false;
};
export const formError = (formControl: FormControlBase<any>) => {
  return formControl.isTouched && formControl.errors.length;
};
export const formValid = (formControl: FormControlBase<any>) => {
  return formControl.isDirty && !formControl.errors.length && formControl.field;
};

export const markDirty = (formControl: FormControlBase<any>) => {
  formControl.isTouched = true;
  formControl.isDirty = true;
};
export const markDirtyAll = (
  formControlObject: Record<string, FormControlBase<any>>
) => {
  for (const key in formControlObject) {
    markDirty(formControlObject[key]);
  }
};

export const formSubmitHttp = (url: string, formData: FormData) => {
  /**
    *  Temporally using to prevent the CORS issue
    *   When uncommenting: Add async to parent function
    *
    * ## Original API Cal
   const asyncData = await $fetch(
     `${config.public.API_BASE_URL}/dealership/${useShopId().value}/sell-car-request`,
     {
       method: "POST",
       body: formData,
       headers: {
         'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryQRQalHkm28wuzSPK',
         'X-Requested-With': 'XMLHttpRequest',
         'accept': "application/json",
       },
     }
   );
   response = asyncData.data?._rawValue;
   */

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.DONE) {
        resolve(xhr.response);
      }
    };
    xhr.onerror = () => {
      reject(xhr.response);
    };
    xhr.open('POST', url);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('accept', 'application/json');
    xhr.send(formData);
  });
};
