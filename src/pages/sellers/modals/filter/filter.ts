import { Component } from '@angular/core';
import { ViewController, ModalController, LoadingController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { SellersCategoriesModalPage } from '../categories/categories';
import { SellersSortModalPage } from '../sort/sort';
import { CitiesModalPage } from '../../../common/cities/cities';

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
    let modal = this.modalCtrl.create(SellersCategoriesModalPage, {category: this.category});
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
    let modal = this.modalCtrl.create(SellersSortModalPage, {sort: this.sort});
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
        location: location
      };

      this.viewCtrl.dismiss(filter);
    }
  }


  clear() {
    this.category = '';
    this.sort = {name: 'Cadastrados Mais Recentemente', value: '-date'};
    this.onlyFollowedSellers = false;
  }
}
