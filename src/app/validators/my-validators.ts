import {FormGroup, FormControl} from '@angular/forms';
import * as moment from 'moment';

export function allRequiredValidator({value}: FormGroup): { [key: string]: any } {
  let controls = Object.keys(value || {});
  let valid = controls.every(control => !!value[control]);

  return valid ? null : {
    allRequired: true
  };
}

export function dateMustBeValid(c: FormControl): { [error: string]: any } {
  const dateIsValid = !c.value || moment(c.value, 'DD/MM/YYYY', true).isValid();

  if (!dateIsValid) {
    return {
      dateMustBeValid: true
    };
  }

  return null;
}

export function mustBeAdult(c: FormControl): { [error: string]: any } {
  const dob = moment(c.value, 'DD/MM/YYYY');
  const age = moment().diff(dob, 'years');
  const isAdult = age >= 18;

  const patternMatches = c.value ? moment(c.value, 'DD/MM/YYYY', true).isValid() : false;
  const shouldValidate = patternMatches && c.valid && (c.value ? c.value.length === 10 : false);

  if (shouldValidate && !isAdult) {
    return {
      mustBeAdult: true
    };
  }

  return null;
}
