import { Component, ViewEncapsulation, OnInit, NgZone } from '@angular/core';
import { UserTokenService } from './services/user-token.service';
import { PERMANENT_BUYER_YES } from './app.constants';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  constructor(private userTokenService: UserTokenService) {
  }

  isCasualBuyer = true;
  mobileDisplayMode = false;

  ngOnInit() {
    this.setMobileDisplayMode();

    // the following code is used for development purpose only
    window.onresize = () => {
      this.setMobileDisplayMode();
    };

    this.userTokenService.getTokenDetails()
      .subscribe(tokenDetails => {
        this.isCasualBuyer = (tokenDetails.permanentBuyerFlag !== PERMANENT_BUYER_YES);
      });
  }

  private setMobileDisplayMode() {
    if (window.innerWidth && window.innerWidth < 550) {
      this.mobileDisplayMode = true;
    } else {
      this.mobileDisplayMode = false;
    }
  }
}
