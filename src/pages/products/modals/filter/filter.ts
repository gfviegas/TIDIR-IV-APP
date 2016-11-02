import { Component } from '@angular/core';
import { ViewController, ModalController, LoadingController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { ProductsSortModalPage } from '../sort/sort';
import { ProductsCategoriesModalPage } from '../categories/categories';
import { CitiesModalPage } from '../../../common/cities/cities';

import { SignService } from '../../../../providers/sign/sign';

export interface SortProducts {
  name: string;
  value: string;
};

@Component({
  templateUrl: 'filter.html'
})
export class ProductsFilterModalPage {
  location: any;
  locationForm: FormGroup;
  state: AbstractControl;
  city: AbstractControl;

  ufs;
  cities;

  seller: boolean = false;
  sellerPage: boolean = false;
  category: string = '';
  sort: SortProducts = {name: 'Mais Novos', value: '-created_at'};
  onlyFollowedSellers: boolean = true;
  onlyInStock: boolean = true;

  constructor(
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public params: NavParams,
    public signService: SignService,
    public fb: FormBuilder
  ) {
    this.category = params.get('category');
    this.sort = params.get('sort');
    this.onlyFollowedSellers = params.get('onlyFollowedSellers');
    this.onlyInStock = params.get('onlyInStock');
    this.sellerPage = params.get('sellerPage');
    this.seller = params.get('seller');

    this.location = params.get('location');

    this.locationForm = fb.group({
      state: [this.location.state, Validators.required],
      city: [this.location.city, Validators.required]
    });

    this.city = this.locationForm.controls['city'];
    this.state = this.locationForm.controls['state'];
  }

  ngOnInit(): void {
    this.loadInit();
  }

  loadInit(): void {
    let loading = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loading.present();

    this.signService.getUfs().subscribe(
      (data) => {
        this.ufs = data;
        let selectedUF = data.find((uf) => { return uf.uf === this.location.state });
        this.state.reset(selectedUF);
        this.city.reset(this.location.city);
        loading.dismiss();
      },
      (error) => {
        loading.dismiss();
        console.info(error);
      }
    );
  }

  clearCity() {
    this.city.reset();
  }

  presentCategoriesModal() {
    let modal = this.modalCtrl.create(ProductsCategoriesModalPage, {category: this.category});
    modal.onDidDismiss(data => {
     this.category = data;
   });

    modal.present();
  }

  presentCitiesModal() {
    let modal = this.modalCtrl.create(CitiesModalPage, {uf: this.state.value.uf, city: this.city.value});
    modal.onDidDismiss(data => {
     this.city.setValue(data);
   });

    modal.present();
  }

  presentSortModal() {
    let modal = this.modalCtrl.create(ProductsSortModalPage, {sort: this.sort});
    modal.onDidDismiss(data => {
     this.sort = data;
   });

    modal.present();
  }

  dismiss() {
    if (this.locationForm.valid) {
      let location = {
        state: this.state.value.uf,
        city: this.city.value
      }
      let filter = {
        category: this.category,
        sort: this.sort,
        onlyFollowedSellers: this.onlyFollowedSellers,
        onlyInStock: this.onlyInStock,
        location: location
      };

      this.viewCtrl.dismiss(filter);
    }
  }

  clear() {
    this.category = '';
    this.sort = {name: 'Mais Novos', value: '-created_at'};
    this.onlyFollowedSellers = true;
    this.onlyInStock = true;
  }
}
