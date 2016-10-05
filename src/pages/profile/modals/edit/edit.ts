import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { SignService } from '../../../../providers/sign/sign';
import { UsersService } from '../../../../providers/users/users';

@Component({
  templateUrl: 'edit.html'
})
export class EditUserPage {

  public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  user: any;

  editForm: FormGroup;
  name: AbstractControl;
  location: AbstractControl;
  state: AbstractControl;
  city: AbstractControl;
  contact: AbstractControl;
  whatsapp: AbstractControl;
  facebook: AbstractControl;
  phone: AbstractControl;
  formSubmitted: boolean = false;

  ufs: any;
  cities: any;

  constructor(
    public fb: FormBuilder,
    public signService: SignService,
    public usersService: UsersService,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public params: NavParams,
    public loadingCtrl: LoadingController
  ) {
    this.user = params.get('user');
    console.log(this.user);

    this.editForm = fb.group({
      name: [this.user.name, Validators.required],
      location: fb.group({
        state: [this.user.location.state, Validators.required],
        city: [this.user.location.city, Validators.required]
      }),
      contact: fb.group({
        whatsapp: [this.user.contact.whatsapp],
        facebook: [this.user.contact.facebook],
        phone: [this.user.contact.phone]
      })
    });
    this.name = this.editForm.controls['name'];

    this.location = this.editForm.controls['location'];
    this.state = this.editForm.controls['location']['controls']['state'];
    this.city = this.editForm.controls['location']['controls']['city'];

    this.contact = this.editForm.controls['contact'];
    this.whatsapp = this.editForm.controls['contact']['controls']['whatsapp'];
    this.facebook = this.editForm.controls['contact']['controls']['facebook'];
    this.phone = this.editForm.controls['contact']['controls']['phone'];
  }

  ngOnInit() {
    let loading = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loading.present();

    this.signService.getUfs().subscribe(
      (data) => {
        loading.dismiss();
        this.ufs = data;
        let selectedUF = data.find((uf) => { return uf.uf === this.user.location.state });
        this.location.patchValue({state: selectedUF});
        console.info(this.state.value);
        // this.state.value = this.user.location.state;
        this.signService.getCities(this.user.location.state).subscribe(
          (cities) => {
            this.cities = cities;
          }
        );
      },
      (error) => {
        loading.dismiss();
        console.info(error);
      }
    );
  }

  cellphoneMask(userInput) {
    // let userInput = this.whatsapp.value;
    let numbers = userInput.match(/\d/g);
    let numberLength = 0;
    if (numbers) {
      numberLength = numbers.join("").length;
    }

    if (numberLength > 10) {
      return ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    } else {
      return ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    }
  }

  getCities() {
    let loading = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loading.present();
    let selectedUF = this.ufs[this.state.value];
    this.signService.getCities(selectedUF.id).subscribe(
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

  submit() {
    this.formSubmitted = true;
    console.log(this.editForm);

    if (this.editForm.valid) {
      let signValues = Object.assign({}, this.editForm.value);
      let params = {
        name: signValues.name,
        email: signValues.email,
        password: signValues.passwords.password,
        location: {
          state: this.ufs[signValues.location.state].uf,
          city: this.cities[signValues.location.city].name,
        }
      };

      console.info('ok', params);

    }
  }

  areEqual(control: FormGroup): void {
    // let valid = false;
    let password = control.controls['password'];
    let confirm = control.controls['confirm'];

    if (password.value !== confirm.value) {
      return confirm.setErrors({ "notEqual": true });
    }

    return null;
  }

  dismiss() {
    return this.viewCtrl.dismiss();
  }

}
