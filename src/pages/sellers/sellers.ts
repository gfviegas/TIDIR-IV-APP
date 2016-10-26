import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';

import { IMG_URL } from '../../app/config';
import { SellersService, SellerObject } from '../../providers/sellers/sellers';
import { AuthService } from '../../providers/auth/auth';

import { SellersFilterModalPage } from './modals/filter/filter';
import { SellerPage } from '../seller/seller';

@Component({
  templateUrl: 'sellers.html'
})
export class SellersPage {

  IMG_URL: string = IMG_URL;
  searchQuery:string = '';
  searchVisible: boolean = false;

  sellers: Array<SellerObject> = [];
  loading: boolean = false;
  currentUser;

  filter: any = {
    category: '',
    sort : {name: 'Cadastrados Mais Recentemente', value: '-date'},
    onlyFollowedSellers: false
  };

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public sellersService: SellersService,
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    this.authService.getLoggedUserData().subscribe(
      (user) => {
        this.currentUser = user;
        this.filter['location'] = user.location;
        this.loadInit();
      }
    );
  }

  loadInit(): void {
    this.loading = true;
    this.sellersService.getAll(this.filter).subscribe(
      sellers => {
        this.sellers = sellers;
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.error(error);
      }
    );
  }

  getItems(event) {
    let query = event.target.value;

    if (query && query.trim() != '') {
      this.loading = true;
      this.sellersService.findSeller(query).subscribe(
        response => {
          this.sellers = response;
          this.loading = false;
        },
        error => {
          console.error(error);
          this.loading = false;
        }
      );
    } else {
      this.loadInit();
    }
  }

  toggleSearchBar() {
    this.searchQuery = '';
    this.loadInit();
    this.searchVisible = !this.searchVisible;
  }

  presentFilterModal() {
    console.info(this.filter);
    let modal = this.modalCtrl.create(SellersFilterModalPage, {filter: this.filter, location: this.filter.location});
    modal.onDidDismiss(data => {
      this.filter = data;
      this.loadInit();
    });
    modal.present();
  }

  showSeller(seller) {
    this.navCtrl.push(SellerPage, {id : seller._id});
  }

}
