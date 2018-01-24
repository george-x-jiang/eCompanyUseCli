import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import {
  PERMANENT_BUYER_YES, PROFILE_TAB, DASHBOARD_TAB, BILLING_TAB, VERIFY_SMS_TAB,
  VERIFY_LICENCE_TAB
} from '../../app.constants';
import { UserTokenService } from '../../services/user-token.service';
import { ProfileService } from '../../services/profile.service';
import { BillingService } from '../../services/billing.service';
import { VerifySmsService } from '../../services/verify-sms.service';
import { DriverLicenceService } from '../../services/driver-licence.service';

@Component({
  selector: 'my-dashboard',
  templateUrl: 'dashboard.html',
  styleUrls: ['dashboard.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  isCasualBuyer = true;
  firstName: string;

  private statusTable = {
    [DASHBOARD_TAB]: 'complete', // i.e., the account has been created
    [PROFILE_TAB]: '',
    [BILLING_TAB]: '',
    [VERIFY_SMS_TAB]: ''
    // [VERIFY_LICENCE_TAB]: ''
  };

  constructor(private userTokenService: UserTokenService,
    private profileService: ProfileService,
    private billingService: BillingService,
    private verifySmsService: VerifySmsService,
    private driverLicenceService: DriverLicenceService) {
  }

  ngOnInit(): void {
    this.userTokenService.getTokenDetails()
      .subscribe(tokenDetails => {
        this.isCasualBuyer = (tokenDetails.permanentBuyerFlag !== PERMANENT_BUYER_YES);
        this.retrieveUserFirstName(tokenDetails.username);

        this.profileService.getProfileStatus(tokenDetails.username)
          .subscribe(
          statusJson => {
            this.statusTable[PROFILE_TAB] = statusJson.completionStatus;
          });
      });

    this.userTokenService.getTokenDetails()
      .subscribe(tokenDetails => {
        this.verifySmsService.getVerifySmsStatus(tokenDetails.username)
          .subscribe(
          statusJson => {
            this.statusTable[VERIFY_SMS_TAB] = statusJson.completionStatus;
          });
      });

    this.userTokenService.getTokenDetails()
      .subscribe(tokenDetails => {
        this.verifySmsService.getVerifySmsStatus(tokenDetails.username)
          .subscribe(
          statusJson => {
            this.statusTable[VERIFY_SMS_TAB] = statusJson.completionStatus;
          });
      });

    this.userTokenService.getTokenDetails()
      .subscribe(tokenDetails => {
        this.billingService.getBillingStatus(tokenDetails.username)
        .subscribe(
            statusJson => {
                this.statusTable[BILLING_TAB] = statusJson.completionStatus;
            }
        );
  });

    this.userTokenService.getTokenDetails()
      .subscribe(tokenDetails => {
        this.driverLicenceService.getVerifyLicenceStatus(tokenDetails.username)
        .subscribe(
            statusJson => {
                this.statusTable[VERIFY_LICENCE_TAB] = statusJson.completionStatus;
            }
        );
  });

    /*
        this.billingService.getBillingStatus(tokenDetails.username)
            .subscribe(
                statusJson => {
                    this.statusTable[BILLING_TAB] = statusJson.completionStatus;
                }
            );

        this.verifySmsService.getVerifySmsStatus(tokenDetails.username)
            .subscribe(
                statusJson => {
                    this.statusTable[VERIFY_SMS_TAB] = statusJson.completionStatus;
                }
            );


        this.driverLicenceService.getVerifyLicenceStatus(tokenDetails.username)
            .subscribe(
                statusJson => {
                    this.statusTable[VERIFY_LICENCE_TAB] = statusJson.completionStatus;
                }
            );
*/
  }

  private retrieveUserFirstName(username: string): void {

    this.profileService.getProfile(username)
      .subscribe(
      userProfile => {
        this.firstName = userProfile.givenName;
      });
  }

  percentageComplete(): string {
    let total = 0, completed = 0;
    let prop: any;
    for (prop in this.statusTable) {
      total++;
      if (this.statusTable[prop] === 'complete') {
        completed++;
      }
    }

    return (completed * 100 / total) + '%';
  }
}
