import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { CategoriesService } from '../../../../providers/categories/categories';

@Component({
  templateUrl: 'categories.html'
})
export class ProductsCategoriesModalPage {
  selectedCategory: any = '';
  categories = [];

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams,
    public categoriesService: CategoriesService
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
