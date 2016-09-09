import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';

import {IMG_URL} from '../../config.ts';
import { SellersService } from '../../providers/sellers/sellers';

import { FilterModalPage } from './modals/filter/filter';

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
    public modalCtrl: ModalController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private sellersService: SellersService
  ) {
  }

  ngOnInit() {
    this.loadInit();
  }

  loadInit(): void {
    this.sellersService.getAll().subscribe(
      sellers => {
        this.sellers = sellers;
      },
      error => {
        console.error(error);
      }
    );
  }

  getItems(event) {
    let query = event.target.value;

    if (query && query.trim() != '') {
      this.sellersService.findSeller(query).subscribe(
        response => {
          this.sellers = response;
        },
        error => {
          console.error(error);
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
    let modal = this.modalCtrl.create(FilterModalPage);
    modal.present();
  }

}