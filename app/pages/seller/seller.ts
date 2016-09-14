import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, ModalController } from 'ionic-angular';

import {IMG_URL} from '../../config.ts';
import { SellersService, SellerObject, Seller } from '../../providers/sellers/sellers';

import { ProductsPage } from '../products/products';

@Component({
  templateUrl: 'build/pages/seller/seller.html',
  providers: [SellersService]
})
export class SellerPage {

  IMG_URL: string = IMG_URL;

  seller: SellerObject = new Seller();

  constructor(
    public params: NavParams,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
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

  mail(email: string) {
    window.open(`mailto:${email}`, '_system');
  }

  call(number: any) {
    window.open(`tel:${SVGNumberList}`, '_system');
  }

  chat(number: any) {
    window.open(`tel:${SVGNumberList}`, '_system');
  }

  presentProductsModal() {
    this.navCtrl.push(ProductsPage, {seller: this.seller});
  }

}
