import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {FormControl} from '@angular/forms';
import {USER_ADMIN_SERVICE_URL} from '../app.constants';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AsyncValidators {

  private readonly POSTCODE_SERVICE_URL = USER_ADMIN_SERVICE_URL + '/profile/queryPostcode';

  constructor(private http: Http) {
  }

  private asyncValidationEventSource = new Subject<string>();
  asyncValidationEventQueue$ = this.asyncValidationEventSource.asObservable();

  postcodeMustBeValid(control: FormControl): Observable<any> {
    if (control.value.length !== 4) {
      return Observable.of(null);
    }

    const observable = this.http.get(this.POSTCODE_SERVICE_URL + '/' + control.value)
      .map((res) => this.validatePostcode(res))
      .catch(() => Observable.of(null));

    return observable;

  }

  private validatePostcode(res: Response) {
    // raise event after the current function completes execution
    setTimeout(() => this.asyncValidationEventSource.next('done'), 0);

    const dataForPostcode = res.json();
    if (!dataForPostcode.length || dataForPostcode.length === 0) {
      return ({
        postcodeMustBeValid: true
      });
    } else {
      return null;
    }

  }

}
