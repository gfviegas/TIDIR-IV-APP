import { Component } from '@angular/core';
import { ViewController, ModalController, NavParams } from 'ionic-angular';

import { ProductsSortModalPage } from '../sort/sort';
import { ProductsCategoriesModalPage } from '../categories/categories';

@Component({
  templateUrl: 'filter.html'
})
export class ProductsFilterModalPage {

  category: string = '';
  sort: Object = {name: 'Mais Novos', value: '-created_at'};
  onlyFollowedSellers: boolean = true;
  onlyInStock: boolean = true;

  constructor(
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public params: NavParams
  ) {
    this.category = params.get('category');
    this.sort = params.get('sort');
    this.onlyFollowedSellers = params.get('onlyFollowedSellers');
    this.onlyInStock = params.get('onlyInStock');
  }

  presentCategoriesModal() {
    let modal = this.modalCtrl.create(ProductsCategoriesModalPage, {category: this.category});
    modal.onDidDismiss(data => {
     this.category = data;
   });

    modal.present();
  }

  presentSortModal() {
    let modal = this.modalCtrl.create(ProductsSortModalPage, {sort: this.sort});
    modal.onDidDismiss(data => {
     this.sort = data;
   });

    modal.present();
  }

  dismiss() {
    let filter = {
      category: this.category,
      sort: this.sort,
      onlyFollowedSellers: this.onlyFollowedSellers,
      onlyInStock: this.onlyInStock
    };

    this.viewCtrl.dismiss(filter);
  }

  clear() {
    this.category = '';
    this.sort = {name: 'Mais Novos', value: '-created_at'};
    this.onlyFollowedSellers = true;
    this.onlyInStock = true;
  }
}
