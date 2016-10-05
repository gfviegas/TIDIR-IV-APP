import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { SellersPage } from '../sellers/sellers';
import { ProductsPage } from '../products/products';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'sellers-tabs.html',
})
export class SellersTabsPage {

  public tabHome: any;
  public tabSellers: any;
  public tabProducts: any;
  public tabProfile: any;

  constructor() {
    this.tabHome = HomePage;
    this.tabSellers = SellersPage;
    this.tabProducts = ProductsPage;
    this.tabProfile = ProfilePage;
  }
}
