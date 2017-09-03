import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';
import { USER_ADMIN_SERVICE_URL } from '../app.constants';

@Injectable()
export class ProfileService {

  // The angular2 service objects are singletons. If using the static modifier, the constant has to be
  // used with the class name, i.e., ProfileService.USER_PROFILE_SERVICE_PATH, even in the same class
  private readonly USER_PROFILE_SERVICE_URL = USER_ADMIN_SERVICE_URL + '/profile';
  private readonly POSTCODE_SERVICE_URL = USER_ADMIN_SERVICE_URL + '/profile/queryPostcode';
  private readonly USER_PROFILE_STATUS_SERVICE_URL = USER_ADMIN_SERVICE_URL + '/profile/status';

  constructor(private http: Http) {
  }

  getProfile(externalAuthId: string): Observable<any> {
    // example header (not necessary)
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    // create the request, store the `Observable` for subsequent subscribers
    const observable = this.http.get(this.USER_PROFILE_SERVICE_URL + '/' + externalAuthId)
      .map(this.extractData)
      .catch(this.handleError);

    return observable;
  }

  getPostcodeData(postcode: string): Observable<any> {
    // create the request, store the `Observable` for subsequent subscribers
    const observable = this.http.get(this.POSTCODE_SERVICE_URL + '/' + postcode)
      .map(this.extractData)
      .catch(this.handleError);

    return observable;
  }

  getProfileStatus(externalAuthId: string): Observable<any> {
    // example header (not necessary)
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // create the request, store the `Observable` for subsequent subscribers
    const observable = this.http.get(this.USER_PROFILE_STATUS_SERVICE_URL + '/' + externalAuthId)
      .map(this.extractData);

    return observable;
  }

  saveProfile(externalAuthId: string, profileData: any): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.put(this.USER_PROFILE_SERVICE_URL + '/' + externalAuthId, profileData, options)
      .map(res => res.status + ' ' + res.statusText)
      .catch(errorRes => {
        throw errorRes.json();
      });
  }

  private extractData(res: Response) {
    const body = res.json();
    return body;
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
