import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import '../rxjs-extensions';
import {USER_ADMIN_SERVICE_URL} from '../app.constants';

@Injectable()
export class VerifySmsService {

  private readonly USER_VERIFY_SMS_STATUS_SERVICE_URL = USER_ADMIN_SERVICE_URL + '/verify/status';

  constructor(private http: Http) {
  }

  getVerifySmsStatus(externalAuthId: string): Observable<any> {
    // example header (not necessary)
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // create the request, store the `Observable` for subsequent subscribers
    const observable = this.http.get(this.USER_VERIFY_SMS_STATUS_SERVICE_URL + '/' + externalAuthId)
      .map(this.extractData);

    return observable;
  }

  private extractData(res: Response) {
    const body = res.json();
    return body;
  }

}
