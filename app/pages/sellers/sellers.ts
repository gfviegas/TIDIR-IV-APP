import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import {IMG_URL} from '../../config.ts';

import { SellersService } from '../../providers/sellers/sellers';

@Component({
  templateUrl: 'build/pages/sellers/sellers.html',
  providers: [SellersService]
})
export class SellersPage {

  IMG_URL: string = IMG_URL;
  searchQuery:string = '';
  searchVisible: boolean = false;

  sellers: Array<any> = [];

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private sellersService: SellersService
  ) {
  }

  ngOnInit() {
    let loading = this.loadingCtrl.create({
      content: 'Pesquisando'
    });
    loading.present();

    this.sellersService.getAll().subscribe(
      sellers => {
        loading.dismiss();
        this.sellers = sellers;
      },
      error => {
        loading.dismiss();
        console.error(error);
      }
    );
  }

  getItems(event) {
    let query = event.target.value;
    this.searchQuery = query;

    let loading = this.loadingCtrl.create({
      content: 'Pesquisando'
    });
    loading.present();

    if (query && query.trim() != '') {
      this.sellersService.findSeller(query).subscribe(
        response => {
          loading.dismiss();
          this.sellers = response;
        },
        error => {
          loading.dismiss();
          console.error(error);
        }
      );
    }
  }

  toggleSearchBar() {
    this.searchVisible = !this.searchVisible;
  }

}
