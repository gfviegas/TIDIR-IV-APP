import { Component } from '@angular/core';
import { ViewController, LoadingController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { SignService } from '../../../../providers/sign/sign';

@Component({
  templateUrl: 'location.html'
})
export class SellersLocationModalPage {
  location: any;
  locationForm: FormGroup;
  state: AbstractControl;
  city: AbstractControl;

  ufs;
  cities;

  constructor(
    public fb: FormBuilder,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public params: NavParams,
    public signService: SignService
  ) {
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

  cancel() {
    this.viewCtrl.dismiss(this.location);
  }

  dismiss() {
    let location = {
      state: this.state.value.uf,
      city: this.city.value.name
    }
    this.viewCtrl.dismiss(location);
  }
}
