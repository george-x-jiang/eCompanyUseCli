import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';
import { PERMANENT_BUYER_ROLE, GET_TOKEN_SERVICE_URL } from '../app.constants';
import { TokenDetails } from '../models/token-details';

@Injectable()
export class UserTokenService {

  private tokenDetails: TokenDetails;
  private observable: Observable<any>;

  constructor(private http: Http) {
  }

  getTokenDetails(): Observable<TokenDetails> {

    if (this.tokenDetails && !this.tokenDetails.isTokenExpired()) {
      // if `data` is available just return it as `Observable`
      return Observable.of(this.tokenDetails);
    } else if (this.observable) {
      // if `this.observable` is set then the request is in progress
      // return the `Observable` for the ongoing request
      return this.observable;
    } else {
      // create the request, store the `Observable` for subsequent subscribers
      this.observable = this.http.get(GET_TOKEN_SERVICE_URL)
        .map(res => this.extractAndStoreData(res))
        .share()
        .catch(this.handleError);

      return this.observable;
    }
  }

  private extractAndStoreData(res: Response) {
    const { username, expiresInSecs, roles } = res.json();
    if (username) {
      const permanentBuyerFlag =
        (roles && roles.indexOf && roles.indexOf(PERMANENT_BUYER_ROLE) >= 0) ? 'Y' : 'N';
      const expiryTime = new Date().getTime() + (expiresInSecs - 30) * 1000; // 30 seconds buffer
      this.tokenDetails = new TokenDetails(username, expiryTime, permanentBuyerFlag);
    }

    this.observable = null;
    return this.tokenDetails;
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      if (error.status === 401) {
        window.location.href = document.URL;
        return;
      }
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    // console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
