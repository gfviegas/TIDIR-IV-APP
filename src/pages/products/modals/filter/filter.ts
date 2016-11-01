import { Component } from '@angular/core';
import { ViewController, ModalController, LoadingController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { ProductsSortModalPage } from '../sort/sort';
import { ProductsCategoriesModalPage } from '../categories/categories';

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
    this.sellerPage = params.get('seller');

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
        this.signService.getCities(this.location.state).subscribe(
          (cities) => {
            this.cities = cities;
            let selectedCity = cities.find((city) => { return city.name === this.location.city });
            this.city.reset(selectedCity);
            loading.dismiss();
          }
        );
      },
      (error) => {
        loading.dismiss();
        console.info(error);
      }
    );
  }

  getCities() {
    let loading = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loading.present();
    let selectedUF = this.state.value.uf;

    this.signService.getCities(selectedUF).subscribe(
      (cities) => {
        loading.dismiss();
        this.cities = cities;
      },
      (error) => {
        loading.dismiss();
        console.info(error);
      }
    );
  }

  presentCategoriesModal() {
    let modal = this.modalCtrl.create(ProductsCategoriesModalPage, {category: this.category});
    modal.onDidDismiss(data => {
     this.category = data;
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
    let location = {
      state: this.state.value.uf,
      city: this.city.value.name
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

  clear() {
    this.category = '';
    this.sort = {name: 'Mais Novos', value: '-created_at'};
    this.onlyFollowedSellers = true;
    this.onlyInStock = true;
  }
}
