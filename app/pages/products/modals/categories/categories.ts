import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { CategoriesService } from '../../../../providers/categories/categories';

@Component({
  templateUrl: 'build/pages/sellers/modals/categories/categories.html',
  providers: [CategoriesService]
})
export class CategoriesModalPage {
  selectedCategory: any = '';
  categories = [];

  constructor(
    private viewCtrl: ViewController,
    private params: NavParams,
    private categoriesService: CategoriesService
  ) {
    this.selectedCategory = params.get('category');

    this.categoriesService.getAll().subscribe(
      categories => {
        this.categories = categories;
      },
      err => {
        console.error(err);
      }
    );
  }

  cancel() {
    this.selectedCategory = '';
    this.dismiss();
  }

  select() {
    if (this.selectedCategory != '' && this.selectedCategory != this.params.get('category')) {
      this.dismiss();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss(this.selectedCategory);
  }
}
