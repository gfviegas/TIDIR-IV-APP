import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { IMG_URL } from '../../app/config';

import { ProductObject, Product } from '../../providers/products/products';

// import { ImageViewerDirective } from 'ionic-img-viewer';
import { SellerPage } from '../seller/seller';

@Component({
  templateUrl: 'product.html',
})
export class ProductPage {

  IMG_URL: string = IMG_URL;
  sellerPage: boolean = false;
  slideOptions = {
    pager: true,
    initialSlide: 0,
    loop: true,
    autoplay: 3500,
    autoplayDisableOnInteraction: true
  };
  product: ProductObject = new Product();

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public params: NavParams
  ) {
    this.product = this.params.get('product');
    this.sellerPage = this.params.get('sellerPage');
  }

  showSeller() {
    this.navCtrl.push(SellerPage, {id : this.product.seller._id});
  }

}
