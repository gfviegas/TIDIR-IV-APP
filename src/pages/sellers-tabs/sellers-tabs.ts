import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { SellerPostsPage } from '../seller-posts/seller-posts';
import { ProductsPage } from '../products/products';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'sellers-tabs.html',
})
export class SellersTabsPage {

  public tabSellersPosts: any;
  public tabHome: any;
  public tabProducts: any;
  public tabProfile: any;

  constructor() {
    this.tabSellersPosts = SellerPostsPage;
    this.tabHome = HomePage;
    this.tabProducts = ProductsPage;
    this.tabProfile = ProfilePage;
  }
}
