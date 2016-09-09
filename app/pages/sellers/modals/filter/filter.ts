import { Component } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';

import { CategoriesModalPage } from '../categories/categories';

@Component({
  templateUrl: 'build/pages/sellers/modals/filter/filter.html'
})
export class FilterModalPage {

  category: string = '';

  constructor(
    public modalCtrl: ModalController,
    private viewCtrl: ViewController
  ) {
  }

  presentCategoriesModal() {
    let modal = this.modalCtrl.create(CategoriesModalPage);
    modal.onDidDismiss(data => {
     this.category = data;
   });

    modal.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
