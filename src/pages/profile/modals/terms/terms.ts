import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'terms.html'
})
export class TermsPage {

  constructor(
    public viewCtrl: ViewController
  ) {
  }

  dismiss() {
    return this.viewCtrl.dismiss();
  }

}
