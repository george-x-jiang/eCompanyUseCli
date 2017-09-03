import { Injectable } from '@angular/core';
import { USER_ADMIN_SERVICE_URL } from '../app.constants';
import { Response, Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';

@Injectable()
export class DriverLicenceService {

  private readonly USER_VERIFY_LICENCE_STATUS_SERVICE_URL = USER_ADMIN_SERVICE_URL + '/driver-licence/status';

  constructor(private http: Http) {
  }

  getVerifyLicenceStatus(externalAuthId: string): Observable<any> {
    // example header (not necessary)
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // create the request, store the `Observable` for subsequent subscribers
    const observable = this.http.get(this.USER_VERIFY_LICENCE_STATUS_SERVICE_URL + '/' + externalAuthId)
      .map(this.extractData);

    return observable;
  }

  private extractData(res: Response) {
    const body = res.json();
    return body;
  }

}
