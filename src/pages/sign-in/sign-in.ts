import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../providers/auth/auth';
import { SignService } from '../../providers/sign/sign';
// import MaskedInput from 'angular2-text-mask';

import { TabsPage } from '../tabs/tabs';

@Component({
  templateUrl: 'sign-in.html'
})
export class SignInPage {

  public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  signInForm: FormGroup;
  name: AbstractControl;
  email: AbstractControl;
  passwords: AbstractControl;
  password: AbstractControl;
  confirm: AbstractControl;
  location: AbstractControl;
  state: AbstractControl;
  city: AbstractControl;
  contact: AbstractControl;
  whatsapp: AbstractControl;
  facebook: AbstractControl;
  phone: AbstractControl;
  signAsSeller : AbstractControl;
  formSubmitted: boolean = false;

  ufs: any;
  cities: any;

  constructor(
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public signService: SignService,
    public authService: AuthService,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController
  ) {
    this.signInForm = fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required, this.emailExists.bind(this)],
      passwords:  fb.group({
        password: ['', Validators.required],
        confirm: ['', Validators.required]
      }, {validator: this.areEqual}),
      location: fb.group({
        state: ['', Validators.required],
        city: ['', Validators.required]
      }),
      contact: fb.group({
        whatsapp: [''],
        facebook: [''],
        phone: ['']
      }),
      signAsSeller: [false]
    });
    this.name = this.signInForm.controls['name'];
    this.email = this.signInForm.controls['email'];

    this.passwords = this.signInForm.controls['passwords'];
    this.password = this.signInForm.controls['passwords']['controls']['password'];
    this.confirm = this.signInForm.controls['passwords']['controls']['confirm'];

    this.location = this.signInForm.controls['location'];
    this.state = this.signInForm.controls['location']['controls']['state'];
    this.city = this.signInForm.controls['location']['controls']['city'];

    this.contact = this.signInForm.controls['contact'];
    this.whatsapp = this.signInForm.controls['contact']['controls']['whatsapp'];
    this.facebook = this.signInForm.controls['contact']['controls']['facebook'];
    this.phone = this.signInForm.controls['contact']['controls']['phone'];

    this.signAsSeller = this.signInForm.controls['signAsSeller'];
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

  signIn() {
    this.formSubmitted = true;
    console.log(this.signInForm);

    if (this.signInForm.valid) {
      let signValues = Object.assign({}, this.signInForm.value);
      let signAsSeller = signValues.signAsSeller;
      let params = {
        name: signValues.name,
        email: signValues.email,
        password: signValues.passwords.password,
        location: {
          state: this.ufs[signValues.location.state].uf,
          city: this.cities[signValues.location.city].name,
        }
      };

      if (!signAsSeller) {
        this.signService.signUser(params).subscribe(
          response => {
            if (response) {
              this.loginSignedUser(params, 'user');
            }
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        this.signService.signSeller(params).subscribe(
          response => {
            if (response) {
              this.loginSignedUser(params, 'seller');
            }
          },
          (err) => {
            console.log(err);
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

  emailExists(control: FormGroup) {
    let requestedEmail = control.value;
    return new Promise((resolve, reject) => {
      this.signService.checkIfEmailExists(requestedEmail).subscribe(
        (response) => {
          if (response.taken) {
            resolve({taken: true});
          } else {
            resolve(null);
          }
        },
        (error) => {
          console.log(error);
        }
      )
    });
  }

  loginSignedUser(params: any, type: string) {
    console.log(params);
    // loading.present();
    this.authService.login(params.email, params.password, type).subscribe(
      success => {
        // loading.dismiss();
        this.presentAlert('Sucesso!', 'Cadastrado com sucesso!');
        this.navCtrl.setRoot(TabsPage);
      },
      error => {
      }
    );
  }

  presentAlert(title: string, subTitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }


}
