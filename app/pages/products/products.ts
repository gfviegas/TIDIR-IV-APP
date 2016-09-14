import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, NavParams } from 'ionic-angular';

import {IMG_URL} from '../../config.ts';
import { SellersService, SellerObject, Seller } from '../../providers/sellers/sellers';
import { ProductsService, ProductObject, Product } from '../../providers/products/products';

import { FilterModalPage } from './modals/filter/filter';
import { SellerPage } from '../seller/seller';

@Component({
  templateUrl: 'build/pages/products/products.html',
  providers: [SellersService, ProductsService]
})
export class ProductsPage {

  IMG_URL: string = IMG_URL;
  searchQuery:string = '';
  searchVisible: boolean = false;

  products: Array<ProductObject> = [];
  seller:SellerObject = new Seller();
  loading: boolean = false;

  filter: Object = {
    category: '',
    sort : {name: 'Mais Novos', value: '-created_at'},
    onlyFollowedSellers: true,
    onlyInStock: true
  };

  constructor(
    public modalCtrl: ModalController,
    private navCtrl: NavController,
    public params: NavParams,
    private loadingCtrl: LoadingController,
    private productsService: ProductsService,
    private sellersService: SellersService
  ) {
    let seller = params.get('seller');
    if (seller) {
      this.seller = seller;
    }
  }

  ngOnInit() {
    this.loadInit();
  }

  loadInit(): void {
    this.loading = true;

    if (this.seller['_id'] != '') {
      this.sellersService.getProducts(this.seller['_id']).subscribe(
        products => {
          this.products = products;
          this.loading = false;
        },
        error => {
          this.loading = false;
          console.error(error);
        }
      );
    } else {
      this.productsService.getAll(this.filter).subscribe(
        products => {
          this.products = products;
          this.loading = false;
        },
        error => {
          this.loading = false;
          console.error(error);
        }
      );
    }
  }

  getItems(event) {
    let query = event.target.value;

    if (query && query.trim() != '') {
      this.loading = true;
      this.productsService.findProduct(query).subscribe(
        response => {
          this.products = response;
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
    let modal = this.modalCtrl.create(FilterModalPage, this.filter);
    modal.onDidDismiss(data => {
      this.filter = data;
      this.loadInit();
    });
    modal.present();
  }

}
