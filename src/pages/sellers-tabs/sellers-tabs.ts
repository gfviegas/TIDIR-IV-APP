import { Component } from '@angular/core';

import { SellerPostsPage } from '../seller-posts/seller-posts';
import { StockPage } from '../stock/stock';
import { ProductsPage } from '../products/products';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'sellers-tabs.html',
})
export class SellersTabsPage {

  public tabSellersPosts: any;
  public tabStock: any;
  public tabProducts: any;
  public tabProfile: any;

  constructor() {
    this.tabSellersPosts = SellerPostsPage;
    this.tabStock = StockPage;
    this.tabProducts = ProductsPage;
    this.tabProfile = ProfilePage;
  }
}
