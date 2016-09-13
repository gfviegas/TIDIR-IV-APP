import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';

import {IMG_URL} from '../../config.ts';
import { SellersService } from '../../providers/sellers/sellers';

@Component({
  templateUrl: 'build/pages/seller/seller.html',
  providers: [SellersService]
})
export class SellerPage {

  IMG_URL: string = IMG_URL;

  seller: Object = {};

  constructor(
    public params: NavParams,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private sellersService: SellersService
  ) {
  }

  ngOnInit() {
    this.loadInit();
  }

  loadInit(): void {
    let loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loading.present();

    let sellerId = this.params.get('id');
    console.log(this.params.data);

    this.sellersService.getById(sellerId).subscribe(
      seller => {
        this.seller = seller;
        loading.dismiss();
      },
      error => {
        console.error(error);
        loading.dismiss();
      }
    );
  }

}
