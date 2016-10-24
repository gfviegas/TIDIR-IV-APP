import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, NavParams } from 'ionic-angular';

import { IMG_URL } from '../../app/config';
import { SellersService, SellerObject, Seller } from '../../providers/sellers/sellers';
import { ProductsService, ProductObject } from '../../providers/products/products';
import { AuthService } from '../../providers/auth/auth';

import { ProductsFilterModalPage } from './modals/filter/filter';
import { CreateProductPage } from './modals/create/create';
import { ProductPage } from '../product/product';

@Component({
  templateUrl: 'products.html'
})
export class ProductsPage {

  sellerPage: boolean = false;

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
    public navCtrl: NavController,
    public params: NavParams,
    public loadingCtrl: LoadingController,
    public productsService: ProductsService,
    public sellersService: SellersService,
    public authService: AuthService
  ) {
    let seller = params.get('seller');
    if (seller) {
      this.seller = seller;
    }

    let type = authService.getLoggedUser().type;
    if (type === 'seller') {
      this.sellerPage = true;
      this.filter = {
        category: '',
        sort : {name: 'Mais Novos', value: '-created_at'},
        onlyFollowedSellers: false,
        onlyInStock: false
      };
      authService.getLoggedUserData().subscribe(
        (seller) => {
          this.seller = seller;
        }
      )
    }
  }

  ionViewDidEnter() {
    let type = this.authService.getLoggedUser().type;
    if (type === 'seller') {
      this.sellerPage = true;
      this.filter = {
        category: '',
        sort : {name: 'Mais Novos', value: '-created_at'},
        onlyFollowedSellers: false,
        onlyInStock: false
      };
      this.authService.getLoggedUserData().subscribe(
        (seller) => {
          this.seller = seller;
          this.loadInit();
        }
      )
    } else {
      this.loadInit();
    }
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
      this.productsService.findProduct(query, this.seller._id).subscribe(
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
    let params = Object.assign(this.filter, {seller: this.sellerPage});
    let modal = this.modalCtrl.create(ProductsFilterModalPage, params);
    modal.onDidDismiss(data => {
      this.filter = data;
      this.loadInit();
    });
    modal.present();
  }

  presentProduct(product: ProductObject) {
    this.navCtrl.push(ProductPage, {product: product, sellerPage: this.sellerPage, seller: this.seller});
  }

  presentCreateModal() {
    let modal = this.modalCtrl.create(CreateProductPage, {});
    modal.onDidDismiss(data => {
      if (data.created) {
        this.products.push(data.product);
      }
    });
    modal.present();
  }

}
