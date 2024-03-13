import { FormControlBase } from '@/util/form-control';
export enum FormControlType {
  Field = 'Field',
  Textbox = 'Textbox',
  Check = 'Check',
  Radio = 'Radio',
  Date = 'Date',
}
export enum FormDataType {
  String = 'String',
  Number = 'Number',
  Date = 'Date',
  Boolean = 'Boolean',
}

export interface FormConfig {
  dataType?: FormDataType;
  elType?: FormControlType;
  resetValue?: any;
}
export type ValidatorFunction = (formControl: FormControlBase) => void;
