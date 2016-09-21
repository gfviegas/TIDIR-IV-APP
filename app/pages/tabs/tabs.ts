import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { SellersPage } from '../sellers/sellers';
import { ProductsPage } from '../products/products';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html',
})
export class TabsPage {

  private tabHome: any;
  private tabSellers: any;
  private tabProducts: any;
  private tabProfile: any;

  constructor(
    private navCtrl: NavController
  ) {
    this.tabHome = HomePage;
    this.tabSellers = SellersPage;
    this.tabProducts = ProductsPage;
    this.tabProfile = ProfilePage;
  }

  changedTab() {
    console.log('changed: ', this.navCtrl.id);
  }
}
