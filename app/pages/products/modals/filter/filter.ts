import { Component } from '@angular/core';
import { ViewController, ModalController, NavParams } from 'ionic-angular';

import { CategoriesModalPage } from '../categories/categories';
import { SortModalPage } from '../sort/sort';

@Component({
  templateUrl: 'build/pages/sellers/modals/filter/filter.html'
})
export class FilterModalPage {

  category: string = '';
  sort: Object = {name: 'Cadastrados Mais Recentemente', value: '-created_at'};
  onlyFollowedSellers: boolean = true;

  constructor(
    public modalCtrl: ModalController,
    private viewCtrl: ViewController,
    private params: NavParams
  ) {
    this.category = params.get('category');
    this.sort = params.get('sort');
    this.onlyFollowedSellers = params.get('onlyFollowedSellers');
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
      onlyFollowedSellers: this.onlyFollowedSellers
    };

    this.viewCtrl.dismiss(filter);
  }

  clear() {
    this.category = '';
    this.sort = {name: 'Cadastrados Mais Recentemente', value: '-created_at'};
    this.onlyFollowedSellers = true;
  }
}
