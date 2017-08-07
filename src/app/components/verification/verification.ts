import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PERMANENT_BUYER_YES} from '../../app.constants';
import {UserTokenService} from '../../services/user-token.service';

@Component({
  selector: 'verification',
  templateUrl: './verification.html',
  styleUrls: ['verification.scss'],
  encapsulation: ViewEncapsulation.None
})

export class VerificationComponent implements OnInit {

  constructor(private userTokenService: UserTokenService, private router: Router) {
  }

  ngOnInit(): void {
    this.userTokenService.getTokenDetails()
      .subscribe(tokenDetails => {
        if (tokenDetails.permanentBuyerFlag === PERMANENT_BUYER_YES) {
          this.router.navigate(['/dashboard']);
        }
      });
  }

}
