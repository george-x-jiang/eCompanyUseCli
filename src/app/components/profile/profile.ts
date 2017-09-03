import { Component, ViewEncapsulation, OnInit, Inject, InjectionToken } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PERMANENT_BUYER_YES } from '../../app.constants';
import { UserTokenService } from '../../services/user-token.service';
import 'rxjs/add/operator/debounceTime';
import { PageScrollService, PageScrollInstance, PageScrollConfig } from 'ng2-page-scroll';
import { DOCUMENT } from '@angular/platform-browser';
import { dateMustBeValid, mustBeAdult } from '../../validators/my-validators';
import { AsyncValidators } from '../../validators/async-validators';


@Component({
  selector: 'my-profile',
  templateUrl: 'profile.html',
  styleUrls: ['profile.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  userProfile: any;
  serverError: any;
  profileForm: FormGroup;
  username: string;
  isCasualBuyer = false;

  genders = [
    { label: 'Please select', value: '' },
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
  ];

  titles = [
    { label: 'Please select', value: '' },
    { label: 'Mr', value: 'Mr' },
    { label: 'Mrs', value: 'Mrs' },
    { label: 'Miss', value: 'Miss' },
    { label: 'Ms', value: 'Ms' },
    { label: 'Dr', value: 'Dr' }
  ];

  states = [
    { label: 'Please select', value: '' },
    { label: 'NSW', value: 'NSW' },
    { label: 'NT', value: 'NT' },
    { label: 'QLD', value: 'QLD' },
    { label: 'SA', value: 'SA' },
    { label: 'TAS', value: 'TAS' },
    { label: 'VIC', value: 'VIC' },
    { label: 'WA', value: 'WA' }
  ];

  countries = [
    { label: 'Australia', value: 'Australia' },
    { label: 'New Zealand', value: 'New Zealand' }
  ];

  formErrors = {
    'title': '',
    'givenName': '',
    'surname': '',
    // 'email': '',
    'dob': '',
    'gender': '',
    'addressLine1': '',
    'addressLine2': '',
    'suburb': '',
    'postcode': '',
    'state': '',
    'Country': '',
    'organisation': '',
    'fax': '',
    'homePhone': '',
    'motorDealer': '',
    'driversLicence': ''
  };

  validationMessages = {
    'title': {
      'required': 'Title is required'
    },
    'givenName': {
      'required': 'First name is required',
      'minlength': 'First name must be at least 2 characters long',
      'maxlength': 'First name must be less than 50 characters long',
      'pattern': 'Invalid characters. First name can only contain: '
      + 'letters of the alphabet; an apostrophe; a hyphen; a space; or a full stop'
    },
    'surname': {
      'required': 'Last name is required.',
      'minlength': 'Last name must be at least 2 characters long',
      'maxlength': 'Last name must be less than 50 characters long',
      'pattern': 'Invalid characters. Last name can only contain: '
      + 'letters of the alphabet; an apostrophe; a hyphen; a space; or a full stop'
    },
    /*
    'email': {
        'required':      'Email is required',
        'pattern':       'Invalid email address. Please update',
    },
    */
    'dob': {
      'required': 'Date of birth is required',
      'mustBeAdult': 'You must be 18 years or older to complete your eCompany profile',
      'dateMustBeValid': 'Invalid date. Must be DD/MM/YYYY',
      // 'pattern':       'Invalid date format. Must match DD/MM/YYYY',
    },
    'gender': {
      'required': 'Gender is required'
    },
    'addressLine1': {
      'required': 'Street Address 1 is required',
      'maxlength': 'Street Address 1 must be less than 255 characters long',
    },
    'addressLine2': {
      'required': 'Street Address 2 is required',
      'maxlength': 'Street Address 2 must be less than 255 characters long',
    },
    'organisation': {
      'maxlength': 'Company name must be less than 255 characters long',
    },
    'motorDealer': {
      'maxlength': 'Company name must be less than 50 characters long',
    },
    'suburb': {
      'required': 'Suburb/City is required'
    },
    'postcode': {
      'required': 'postcode is required',
      'minlength': 'Postcode must be 4 digits long',
      'maxlength': 'Postcode must be 4 digits long',
      'pattern': 'Postcode must be numbers only',
      'postcodeMustBeValid': 'Postcode could not be found'
    },
    'state': {
      'required': 'State is required'
    },
    'fax': {
      'pattern': 'Fax No must be numbers only'
    },
    'homePhone': {
      'pattern': 'Tel No must be numbers only'
    },
    'driversLicence': {
      'minlength': 'Driver licence No. must be at least 4 digits long',
      'maxlength': 'Driver licence No. must be less than 10 digits long'
    }
  };

  successMsg: string;
  errorMsg: string;

  constructor(private userTokenService: UserTokenService, private pageScrollService: PageScrollService,
    private profileService: ProfileService, private asyncValidators: AsyncValidators,
    @Inject(DOCUMENT) private document: Document) {

    PageScrollConfig.defaultScrollOffset = -50;
    PageScrollConfig.defaultDuration = 500;

  }

  ngOnInit(): void {
    this.userTokenService.getTokenDetails()
      .subscribe(tokenDetails => {
        this.isCasualBuyer = (tokenDetails.permanentBuyerFlag !== PERMANENT_BUYER_YES);
        this.username = tokenDetails.username;
        this.retrieveUserProfile();
      });


    // this.buildForm();
  }

  private retrieveUserProfile(): void {

    this.profileService.getProfile(this.username)
      .subscribe(
      userProfile => {
        this.userProfile = userProfile;
        this.buildForm();

        this.asyncValidators.asyncValidationEventQueue$.subscribe(
          () => this.onValueChanged());
      },

      error => {
        this.serverError = <any>error;
      }
      );
  }

  private buildForm(): void {

    const numberOnly = '^[0-9 ]{1,45}$';

    const nameRegex = /^[a-zA-Z\'\-\.\s]{1,}$/;

    const buyer = this.userProfile;

    if (!this.isCasualBuyer) {
      this.profileForm = new FormGroup({
        'givenName': new FormControl(buyer.givenName, [
          Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(nameRegex)
        ]),
        'surname': new FormControl(buyer.surname, [
          Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(nameRegex)
        ])
      });

    } else {
      this.profileForm = new FormGroup({
        'title': new FormControl(buyer.title || '', Validators.required),
        'givenName': new FormControl(buyer.givenName, [
          Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(nameRegex)
        ]),
        'surname': new FormControl(buyer.surname, [
          Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(nameRegex)
        ]),
        'email': new FormControl(buyer.email),
        'dob': new FormControl(buyer.dob, [Validators.required, dateMustBeValid, mustBeAdult]),
        'gender': new FormControl(buyer.gender || '', Validators.required),
        'addressLine1': new FormControl(buyer.addressLine1, [Validators.maxLength(255), Validators.required]),
        'addressLine2': new FormControl(buyer.addressLine2, Validators.maxLength(255)),
        'suburb': new FormControl(buyer.suburb, Validators.required),
        'postcode': new FormControl(buyer.postcode, [
          Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern(numberOnly)
        ], this.asyncValidators.postcodeMustBeValid.bind(this.asyncValidators)),
        'state': (buyer.country === 'New Zealand') ?
          new FormControl('') : new FormControl(buyer.state || '', Validators.required),
        'country': new FormControl(buyer.country || 'Australia', Validators.required),
        'homePhone': new FormControl(buyer.homePhone, Validators.pattern(numberOnly)),
        'fax': new FormControl(buyer.fax, Validators.pattern(numberOnly)),
        'organisation': new FormControl(buyer.organisation, Validators.maxLength(255)),
        'motorDealer': new FormControl(buyer.motorDealer, Validators.maxLength(50)),
        'driversLicence': new FormControl(buyer.driversLicence, [Validators.maxLength(10), Validators.minLength(4)])
      });

      this.profileForm.get(['country']).valueChanges.subscribe(
        value => this.countryChanged(value)
      );

    }

    this.profileForm.valueChanges.subscribe(
      data => this.onValueChanged(data)
    );

    this.onValueChanged(); // (re)set validation messages now
  }

  countryChanged(value: string): void {
    const state = this.profileForm.get(['state']);
    if (value === 'New Zealand') {
      state.setValidators(null);
      state.reset('');
    } else {
      state.setValidators(Validators.required);
    }
  }

  onValueChanged(data?: any) {
    // clean up server side message when user types into form after initial save
    this.errorMsg = null;
    this.successMsg = null;

    if (!this.profileForm) { return; }
    const form = this.profileForm;
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

  getErrorBorder(fieldName: string): string {
    if (!this.profileForm.get([fieldName]).valid && !this.profileForm.get([fieldName]).pristine) {
      return 'has-error has-feedback';
    } else if (this.profileForm.get([fieldName]).valid) {
      return 'has-success has-feedback';
    }
  }

  getErrorBorderSelect(fieldName: string): string {
    if (!this.profileForm.get([fieldName]).valid && !this.profileForm.get([fieldName]).pristine) {
      return 'has-error has-feedback';
    } else if (this.profileForm.get([fieldName]).valid && this.profileForm.get([fieldName]).dirty) {
      return 'has-success has-feedback';
    }
  }

  getIndicator(fieldName: string): string {
    if (!this.profileForm.get([fieldName]).valid && !this.profileForm.get([fieldName]).pristine) {
      return 'glyphicon glyphicon-remove form-control-feedback red';
    } else if (this.profileForm.get([fieldName]).valid && this.profileForm.get([fieldName]).value) {
      return 'glyphicon glyphicon-ok form-control-feedback green';
    }
  }

  onSubmit() {
    this.userTokenService.getTokenDetails()
      .subscribe(tokenDetails => {
        this.isCasualBuyer = (tokenDetails.permanentBuyerFlag !== PERMANENT_BUYER_YES);
        this.username = tokenDetails.username;
        this.saveProfile();
      });
  }

  private saveProfile() {
    const profileData = this.profileForm.value;
    profileData.permanentBuyer = !this.isCasualBuyer;

    this.profileService.saveProfile(this.username, profileData)
      .subscribe(
      result => {
        const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#my-profile-spa');
        this.pageScrollService.start(pageScrollInstance);

        this.userProfile = profileData;
        this.successMsg = 'Your profile has been updated successfully';
      },
      error => {
        const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#my-profile-spa');
        this.pageScrollService.start(pageScrollInstance);
        this.errorMsg = error.errorCause;
      }
      );
  }
}
