import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/sellers/modals/categories/categories.html'
})
export class CategoriesModalPage {
  selectedCategory: any = '';
  constructor(
    private viewCtrl: ViewController
  ) {
  }

  cancel() {
    this.selectedCategory = '';
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss(this.selectedCategory);
  }
}
