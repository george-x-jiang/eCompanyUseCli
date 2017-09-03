import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { allRequiredValidator } from '../../validators/my-validators';
import { ProfileService } from '../../services/profile.service';
import { UserTokenService } from '../../services/user-token.service';

@Component({
  selector: 'my-billing',
  templateUrl: 'billing.html',
  styleUrls: ['billing.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillingComponent implements OnInit {

  private readonly MONTHS_OF_YEAR = ['', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  private currentYear: number;
  private currentMonth: number;

  months: Array<string>;
  years: Array<string>;

  firstName: string;
  lastName: string;
  showCardBack = false;

  billingForm: FormGroup;

  formErrors = {
    'cardType': { errMessages: '' },
    'cardNumber': { errMessages: '' },
    'cvv': { errMessages: '' },
    'expiryDate': {
      errMessages: '',
      'month': { errMessages: '' },
      'year': { errMessages: '' }
    }
  };

  private validationMessages = {
    'cardType': {
      'required': 'Please select a credit card type'
    },
    'cardNumber': {
      'required': 'Card number is required',
      'pattern': 'Card number must be 16 digits',
      'cardNumberAndTypeValidator': 'Invalid card details'
    },
    'cvv': {
      'required': 'CVV is required',
      'pattern': 'CVV must be 3 digits'
    },
    'expiryDate': {
      'allRequired': 'Expiry date is required',
      'month': {},
      'year': {}
    }
  };

  cardTypes = [
    { label: 'Please select', value: '' },
    { label: 'Visa', value: 'Visa' },
    { label: 'Mastercard', value: 'Mastercard' }
  ];

  constructor(private userTokenService: UserTokenService,
    private profileService: ProfileService) {
  }

  ngOnInit(): void {
    this.userTokenService.getTokenDetails()
      .subscribe(tokenDetails => {
        this.retrieveUserFullName(tokenDetails.username);
      });

    this.buildForm();
    this.initExpiryDate();
  }

  private retrieveUserFullName(username: string): void {
    this.profileService.getProfile(username)
      .subscribe(
      userProfile => {
        this.firstName = userProfile.givenName;
        this.lastName = userProfile.surname;
      }
      );
  }

  buildForm(): void {
    const cardNumberPattern = '^[0-9]{16}$';
    const cvvPattern = '^[0-9]{3}$';

    this.billingForm = new FormGroup({
      'cardType': new FormControl('', Validators.required),
      'cardNumber': new FormControl('', [
        Validators.required,
        Validators.pattern(cardNumberPattern)
      ]),
      'cvv': new FormControl('', [
        Validators.required,
        Validators.pattern(cvvPattern)
      ]),
      'expiryDate': new FormGroup({
        'month': new FormControl(''),
        'year': new FormControl('')
      }, allRequiredValidator)
    });

    this.billingForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.billingForm.get(['cardType']).valueChanges
      .subscribe(() => {
        const cardNumberControl = this.billingForm.get(['cardNumber']);
        cardNumberControl.updateValueAndValidity();
      });
    this.billingForm.get(['expiryDate', 'year']).valueChanges
      .subscribe(() => this.generateMonths(this.billingForm.get(['expiryDate', 'month'])));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.billingForm) { return; }
    const form = this.billingForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field].errMessages = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field].errMessages += messages[key] + ' ';
        }
      }
    }
  }

  getErrorBorder(fieldName: string): string {
    if (!this.billingForm.get([fieldName]).valid && !this.billingForm.get([fieldName]).pristine) {
      return 'has-error has-feedback';
    } else if (this.billingForm.get([fieldName]).valid) {
      return 'has-success has-feedback';
    }
  }

  getErrorBorderSelect(fieldName: string): string {
    if (!this.billingForm.get([fieldName]).valid && !this.billingForm.get([fieldName]).pristine) {
      return 'has-error has-feedback';
    } else if (this.billingForm.get([fieldName]).valid && this.billingForm.get([fieldName]).dirty) {
      return 'has-success has-feedback';
    }
  }

  getErrorBorderExpiryDate(): string {
    const expiryDateFormField = this.billingForm.get(['expiryDate']);
    if (!expiryDateFormField.valid) {
      return 'has-error has-feedback';
    }
    return 'has-success has-feedback';
  }

  get cardNumber(): string {
    return this.billingForm.get(['cardNumber']).value;
  }

  get cvv(): string {
    return this.billingForm.get(['cvv']).value;
  }

  get year(): string {
    return this.billingForm.get(['expiryDate', 'year']).value;
  }

  get month(): string {
    return this.billingForm.get(['expiryDate', 'month']).value;
  }

  isCardType(cardType: string): boolean {
    return this.billingForm.get(['cardType']).value === cardType;
  }

  private initExpiryDate() {
    const today = new Date();
    this.currentYear = today.getFullYear() - 2000;
    this.currentMonth = today.getMonth() + 1;
    this.generateYears();
    this.generateMonths();
  }

  private generateYears() {
    this.years = [''];
    for (let i = 0; i <= 10; i++) {
      this.years.push((this.currentYear + i) + '');
    }
  }

  private generateMonths(monthControl?: AbstractControl) {
    this.months = this.MONTHS_OF_YEAR;
    if (this.billingForm.get(['expiryDate', 'year']).value === this.currentYear) {
      if (monthControl && monthControl.value < this.currentMonth) {
        monthControl.reset();
      }

      this.months = [''];
      for (let i = this.currentMonth; i <= 12; i++) {
        if (i < 10) {
          this.months.push('0' + i);
        } else {
          this.months.push(i + '');
        }
      }
    }
  }

  saveCard() {
    console.log(this.billingForm.value);
  }

}
