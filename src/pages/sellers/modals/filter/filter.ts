import { Component } from '@angular/core';
import { ViewController, ModalController, LoadingController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { SellersCategoriesModalPage } from '../categories/categories';
import { SellersSortModalPage } from '../sort/sort';
// import { SellersLocationModalPage } from '../location/location';

import { SignService } from '../../../../providers/sign/sign';

export interface SortSellers {
  name: string;
  value: string;
};

@Component({
  templateUrl: 'filter.html'
})
export class SellersFilterModalPage {
  location: any;
  locationForm: FormGroup;
  state: AbstractControl;
  city: AbstractControl;

  ufs;
  cities;

  category: string = '';
  sort: SortSellers = {name: 'Cadastrados Mais Recentemente', value: '-date'};
  onlyFollowedSellers: boolean = false;

  constructor(
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public params: NavParams,
    public signService: SignService,
    public fb: FormBuilder
  ) {
    let filter = params.get('filter');
    this.category = filter.category;
    this.sort = filter.sort;
    this.onlyFollowedSellers = filter.onlyFollowedSellers;

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
    let selectedUF = this.ufs[this.state.value];
    this.signService.getCities(selectedUF.uf).subscribe(
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
    let modal = this.modalCtrl.create(SellersCategoriesModalPage, {category: this.category});
    modal.onDidDismiss(data => {
     this.category = data;
   });

    modal.present();
  }

  // presentLocationModal() {
  //   let modal = this.modalCtrl.create(SellersLocationModalPage, {location: this.location});
  //   modal.onDidDismiss(data => {
  //    this.location = data;
  //  });
  //
  //   modal.present();
  // }

  presentSortModal() {
    let modal = this.modalCtrl.create(SellersSortModalPage, {sort: this.sort});
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
      location: location
    };

    this.viewCtrl.dismiss(filter);
  }

  clear() {
    this.category = '';
    this.sort = {name: 'Cadastrados Mais Recentemente', value: '-date'};
    this.onlyFollowedSellers = false;
  }
}
