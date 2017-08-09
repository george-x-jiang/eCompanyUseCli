import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import './rxjs-extensions';
import {ModalModule} from 'ngx-bootstrap/modal';
import {Ng2PageScrollModule} from 'ng2-page-scroll';

import { AppComponent } from './app.component';
import {DashboardComponent} from './components/dashboard/dashboard';
import {ProfileComponent} from './components/profile/profile';
import {BillingComponent} from './components/billing/billing';
import {VerificationComponent} from './components/verification/verification';
import {ProfileService} from './services/profile.service';
import {DriverLicenceService} from './services/driver-licence.service';
import {VerifyMobileComponent} from './components/verification/verify-mobile';
import {VerifyDriverLicenceComponent} from './components/verification/verify-driver-licence';
import {MobileNavComponent} from './components/navigation/mobile-nav';
import {DesktopNavComponent} from './components/navigation/desktop-nav';
import {UserTokenService} from './services/user-token.service';
import {BillingService} from './services/billing.service';
import {VerifySmsService} from './services/verify-sms.service';
import {AsyncValidators} from './validators/async-validators';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        Ng2PageScrollModule
      ],
      declarations: [
        AppComponent,
        BillingComponent,
        DashboardComponent,
        MobileNavComponent,
        DesktopNavComponent,
        ProfileComponent,
        VerificationComponent,
        VerifyMobileComponent,
        VerifyDriverLicenceComponent
      ],
      providers: [
        ProfileService, BillingService, VerifySmsService, DriverLicenceService, UserTokenService, AsyncValidators
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have isCasualBuyer as true`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.isCasualBuyer).toEqual(true);
  }));

});
