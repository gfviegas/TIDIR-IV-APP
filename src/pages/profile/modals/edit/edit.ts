import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { SignService } from '../../../../providers/sign/sign';
import { UsersService } from '../../../../providers/users/users';
import { SellersService } from '../../../../providers/sellers/sellers';

import { CitiesModalPage } from '../../../common/cities/cities';

@Component({
  templateUrl: 'edit.html'
})
export class EditUserPage {

  public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  user: any;
  userType: string = 'user';

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
    public sellersService: SellersService,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public params: NavParams,
    public loadingCtrl: LoadingController
  ) {
    this.user = params.get('user');
    this.userType = this.params.get('userType');

    let userWhatsapp;
    let userFacebook;
    let userPhone;
    if (this.user.contact) {
      if (this.user.contact.whatsapp) {
        userWhatsapp = this.user.contact.whatsapp;
      }
      if (this.user.contact.facebook) {
        userFacebook = this.user.contact.facebook;
      }
      if (this.user.contact.phone) {
        userPhone = this.user.contact.phone;
      }

      console.log(this.user.contact);
    }


    this.editForm = fb.group({
      name: [this.user.name, Validators.required],
      location: fb.group({
        state: [this.user.location.state, Validators.required],
        city: [this.user.location.city, Validators.required]
      }),
      contact: fb.group({
        whatsapp: [userWhatsapp],
        facebook: [userFacebook],
        phone: [userPhone]
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
    this.editForm.markAsUntouched();
    this.editForm.markAsPristine();

    loading.present();
    this.signService.getUfs().subscribe(
      (data) => {
        loading.dismiss();
        this.ufs = data;
        let selectedUF = data.find((uf) => { return uf.uf === this.user.location.state });
        this.state.reset(selectedUF);
      },
      (error) => {
        loading.dismiss();
        console.info(error);
      }
    );
  }

  presentCitiesModal() {
    let modal = this.modalCtrl.create(CitiesModalPage, {uf: this.state.value.uf, city: this.city.value});
    modal.onDidDismiss(data => {
     this.city.setValue(data);
   });

    modal.present();
  }


  clearCity() {
    this.city.reset();
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

  submit() {
    this.formSubmitted = true;
    console.log(this.editForm);

    if (this.editForm.valid) {
      let editValues = Object.assign({}, this.editForm.value);
      let params = {
        name: editValues.name,
        contact: {
        },
        location: {
          state: editValues.location.state.uf,
          city: editValues.location.city,
        }
      };

      if (editValues.contact.whatsapp) {
        params.contact['whatsapp'] = editValues.contact.whatsapp;
      }
      if (editValues.contact.facebook) {
        params.contact['facebook'] = editValues.contact.facebook;
      }
      if (editValues.contact.phone) {
        params.contact['phone'] = editValues.contact.phone;
      }

      if (this.userType === 'seller') {
        this.sellersService.update(params).subscribe(
          (seller) => {
            this.viewCtrl.dismiss(seller);
          }
        );
      } else {
        this.usersService.update(params).subscribe(
          (user) => {
            this.viewCtrl.dismiss(user);
          }
        );
      }

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
    return this.viewCtrl.dismiss(false);
  }

}
