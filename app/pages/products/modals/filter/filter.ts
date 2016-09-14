import { Component } from '@angular/core';
import { ViewController, ModalController, NavParams } from 'ionic-angular';

import { CategoriesModalPage } from '../categories/categories';
import { SortModalPage } from '../sort/sort';

@Component({
  templateUrl: 'build/pages/products/modals/filter/filter.html'
})
export class FilterModalPage {

  category: string = '';
  sort: Object = {name: 'Mais Novos', value: '-created_at'};
  onlyFollowedSellers: boolean = true;
  onlyInStock: boolean = true;

  constructor(
    public modalCtrl: ModalController,
    private viewCtrl: ViewController,
    private params: NavParams
  ) {
    this.category = params.get('category');
    this.sort = params.get('sort');
    this.onlyFollowedSellers = params.get('onlyFollowedSellers');
    this.onlyInStock = params.get('onlyInStock');
  }

  presentCategoriesModal() {
    let modal = this.modalCtrl.create(CategoriesModalPage, {category: this.category});
    modal.onDidDismiss(data => {
     this.category = data;
   });

    modal.present();
  }

  presentSortModal() {
    let modal = this.modalCtrl.create(SortModalPage, {sort: this.sort});
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
