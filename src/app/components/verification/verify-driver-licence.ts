import {Component, ViewEncapsulation} from '@angular/core';
import {DriverLicenceService} from '../../services/driver-licence.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'verify-driver-licence',
  templateUrl: './verify-driver-licence.html',
  encapsulation: ViewEncapsulation.None
})

export class VerifyDriverLicenceComponent {
  private addressStatus: string;

  public drivingLicenceForm: FormGroup;

  states = [
    {label: 'Please select', value: ''},
    {label: 'NSW', value: 'NSW'},
    {label: 'QLD', value: 'QLD'},
    {label: 'NT', value: 'NT'},
    {label: 'WA', value: 'WA'},
    {label: 'SA', value: 'SA'},
    {label: 'VIC', value: 'VIC'},
    {label: 'TAS', value: 'TAS'}
  ];

  formErrors = {
    'firstname': '',
    'lastname': '',
    'dob': '',
    'stateOfIssue': '',
    'licenceNo': '',
  };

  validationMessages = {
    'firstname': {
      'required': 'First name is required',
      'minlength': 'First name must be at least 2 characters long',
      'maxlength': 'First name must be less than 50 characters long'
    },
    'lastname': {
      'required': 'Last name is required.',
      'minlength': 'Last name must be at least 2 characters long',
      'maxlength': 'Last name must be less than 50 characters long'
    },
    'dob': {
      'required': 'Date of birth is required',
      'pattern': 'Invalid date format. Must match DD/MM/YY',
    },
    'stateOfIssue': {
      'required': 'State of issue is required'
    },
    'licenceNo': {
      'required': 'Licence No. is required.'
    },
  };


  constructor() {
    const dateRegex = '^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/(19|20)[0-9]{2}$';

    this.drivingLicenceForm = new FormGroup({
      'firstname': new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      'lastname': new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      'dob': new FormControl('', [
        Validators.required,
        Validators.pattern(dateRegex)
      ]),
      'stateOfIssue': new FormControl('',
        Validators.required
      ),
      'licenceNo': new FormControl('',
        Validators.required
      )
    });

    this.drivingLicenceForm.valueChanges.subscribe(
      data => this.onValueChanged(data)
    );

    this.onValueChanged(); // (re)set validation messages now

  }

  onValueChanged(data?: any) {
    if (!this.drivingLicenceForm) {
      return;
    }
    const form = this.drivingLicenceForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit() {
    console.log(this.drivingLicenceForm);
  }

  getErrorBorder(fieldName: string): string {
    if (!this.drivingLicenceForm.get([fieldName]).valid && !this.drivingLicenceForm.get([fieldName]).pristine) {
      return 'has-error has-feedback';
    } else if (this.drivingLicenceForm.get([fieldName]).valid) {
      return 'has-success has-feedback';
    }
  }

  getErrorBorderSelect(fieldName: string): string {
    if (!this.drivingLicenceForm.get([fieldName]).valid && !this.drivingLicenceForm.get([fieldName]).pristine) {
      return 'has-error has-feedback';
    } else if (this.drivingLicenceForm.get([fieldName]).valid && this.drivingLicenceForm.get([fieldName]).dirty) {
      return 'has-success has-feedback';
    }
  }

  getIndicator(fieldName: string): string {
    if (!this.drivingLicenceForm.get([fieldName]).valid && !this.drivingLicenceForm.get([fieldName]).pristine) {
      return 'glyphicon glyphicon-remove form-control-feedback red';
    } else if (this.drivingLicenceForm.get([fieldName]).valid) {
      return 'glyphicon glyphicon-ok form-control-feedback green';
    }
  }

  verify() {
  }
}
