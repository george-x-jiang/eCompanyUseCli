import { Component, ViewEncapsulation, Class, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'myprofile-mobile-nav',
  templateUrl: 'mobile-nav.html',
  styleUrls: ['navigation.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MobileNavComponent implements OnInit {
  @Input() isCasualBuyer: boolean;

  mobileToggleDropdown: boolean;

  tabHeadingText: string;
  tabHeadingCss: string;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.router.events
      .filter(e => e instanceof NavigationEnd)
      .subscribe((e: NavigationEnd) => this.tabSelected(e.url));
  }

  private tabSelected(selectedTabUrl: string): void {
    // remove the leading slash
    let selectedTab = selectedTabUrl.substring(1) || 'dashboard';

    // remove sub-path is there is any
    const slashIndex = selectedTab.indexOf('/');
    if (slashIndex > 0) {
      selectedTab = selectedTab.substring(0, slashIndex);
    }

    switch (selectedTab) {
      case 'dashboard':
        this.tabHeadingText = selectedTab;
        this.tabHeadingCss = 'glyphicon glyphicon-home';
        break;
      case 'profile':
        this.tabHeadingText = selectedTab;
        this.tabHeadingCss = 'glyphicon glyphicon-user';
        break;
      case 'verify':
        this.tabHeadingText = selectedTab;
        this.tabHeadingCss = 'glyphicon glyphicon-check';
        break;
      case 'billing':
        this.tabHeadingText = selectedTab;
        this.tabHeadingCss = 'glyphicon glyphicon-credit-card';
        break;
      case 'subscribe':
        this.tabHeadingText = selectedTab;
        this.tabHeadingCss = 'glyphicon glyphicon-bullhorn';
        break;
      case 'password':
        this.tabHeadingText = selectedTab;
        this.tabHeadingCss = 'glyphicon glyphicon-lock';
        break;
    }
  }

}
