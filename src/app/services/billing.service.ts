import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import '../rxjs-extensions';
import {USER_ADMIN_SERVICE_URL} from '../app.constants';

@Injectable()
export class BillingService {

  private readonly USER_BILLING_SERVICE_URL = USER_ADMIN_SERVICE_URL + '/billing';
  private readonly USER_BILLING_STATUS_SERVICE_URL = USER_ADMIN_SERVICE_URL + '/billing/status';

  constructor(private http: Http) {
  }

  getBillingStatus(externalAuthId: string): Observable<any> {
    // example header (not necessary)
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // create the request, store the `Observable` for subsequent subscribers
    const observable = this.http.get(this.USER_BILLING_STATUS_SERVICE_URL + '/' + externalAuthId)
      .map(this.extractData);

    return observable;
  }

  private extractData(res: Response) {
    const body = res.json();
    return body;
  }

}
