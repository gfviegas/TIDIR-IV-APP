import { Component } from '@angular/core';
import { ViewController, ModalController, NavParams } from 'ionic-angular';

import { SellersCategoriesModalPage } from '../categories/categories';
import { SellersSortModalPage } from '../sort/sort';

export interface SortSellers {
  name: string;
  value: string;
};

@Component({
  templateUrl: 'filter.html'
})
export class SellersFilterModalPage {

  category: string = '';
  sort: SortSellers = {name: 'Cadastrados Mais Recentemente', value: '-date'};
  onlyFollowedSellers: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public params: NavParams
  ) {
    this.category = params.get('category');
    this.sort = params.get('sort');
    this.onlyFollowedSellers = params.get('onlyFollowedSellers');
  }

  presentCategoriesModal() {
    let modal = this.modalCtrl.create(SellersCategoriesModalPage, {category: this.category});
    modal.onDidDismiss(data => {
     this.category = data;
   });

    modal.present();
  }

  presentSortModal() {
    let modal = this.modalCtrl.create(SellersSortModalPage, {sort: this.sort});
    modal.onDidDismiss(data => {
     this.sort = data;
   });

    modal.present();
  }

  dismiss() {
    let filter = {
      category: this.category,
      sort: this.sort,
      onlyFollowedSellers: this.onlyFollowedSellers
    };

    this.viewCtrl.dismiss(filter);
  }

  clear() {
    this.category = '';
    this.sort = {name: 'Cadastrados Mais Recentemente', value: '-date'};
    this.onlyFollowedSellers = false;
  }
}
