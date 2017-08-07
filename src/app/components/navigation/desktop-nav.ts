import {Component, ViewEncapsulation, OnInit, Input} from '@angular/core';

@Component({
  selector: 'myprofile-desktop-nav',
  templateUrl: 'desktop-nav.html',
  styleUrls: ['navigation.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DesktopNavComponent {
  @Input() isCasualBuyer: boolean;

}
