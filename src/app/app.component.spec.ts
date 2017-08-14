import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpModule} from '@angular/http';
import './rxjs-extensions';

import { AppComponent } from './app.component';
import {MobileNavComponent} from './components/navigation/mobile-nav';
import {DesktopNavComponent} from './components/navigation/desktop-nav';
import {UserTokenService} from './services/user-token.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule,
      ],
      declarations: [
        AppComponent,
        MobileNavComponent,
        DesktopNavComponent,
      ],
      providers: [
        UserTokenService
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
