import { Component } from '@angular/core';
import { ViewController, LoadingController, NavParams } from 'ionic-angular';

import { SignService } from '../../../providers/sign/sign';

@Component({
  templateUrl: 'cities.html'
})
export class CitiesModalPage {
  selectedUF: any = '';
  selectedCity: any = '';
  cities = [];
  citiesBackup = [];

  changes: number = 0;

  searchQuery: string = '';
  searchVisible: boolean = false;

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams,
    public loadingCtrl: LoadingController,
    public signService: SignService
  ) {
    this.selectedUF = params.get('uf');
    this.selectedCity = params.get('city');

    let loading = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loading.present();

    this.signService.getCities(this.selectedUF).subscribe(
      (cities) => {
        loading.dismiss();
        this.cities = cities.map(c => c.name);
      },
      (error) => {
        loading.dismiss();
        console.info(error);
      }
    );
  }

  cancel() {
    this.selectedCity = '';
    this.dismiss();
  }

  select() {
    if (this.changes === 0) {
      this.changes++;
    } else {
      this.dismiss();
    }
  }

  toggleSearchBar() {
    this.searchVisible = !this.searchVisible;

    if (!this.searchVisible) {
      this.cities = this.citiesBackup;
    } else {
      this.citiesBackup = this.cities;
    }
  }

  filterCities(event) {
    let regexp = new RegExp(event.target.value, 'gi');
    this.cities = this.citiesBackup.filter(c => regexp.test(c));
  }

  dismiss() {
    this.viewCtrl.dismiss(this.selectedCity);
  }
}
