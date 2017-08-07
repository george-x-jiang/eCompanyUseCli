import {Component, TemplateRef, ViewEncapsulation} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
  selector: 'verify-mobile',
  templateUrl: './verify-mobile.html',
  encapsulation: ViewEncapsulation.None
})

export class VerifyMobileComponent {

  public modalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
