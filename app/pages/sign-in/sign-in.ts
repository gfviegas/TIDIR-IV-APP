import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { REACTIVE_FORM_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../providers/auth/auth';
import { SignService } from '../../providers/sign/sign';
import MaskedInput from 'angular2-text-mask'

@Component({
  templateUrl: 'build/pages/sign-in/sign-in.html',
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, MaskedInput],
  providers: [SignService]
})
export class SignInPage {

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
  loading: any;

  mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    private fb: FormBuilder,
    private signService: SignService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
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

    this.loading = loadingCtrl.create({
      content: "Carregando..."
    });
  }

  ngOnInit() {
    this.loading.present();
    this.signService.getUfs().subscribe(
      (data) => {
        this.loading.dismiss();
        this.ufs = data;
      },
      (error) => {
        this.loading.dismiss();
        console.info(error);
      }
    );
  }

  getCities() {
    this.loading.present();
    let selectedUF = this.ufs[this.state.value];
    this.signService.getCities(selectedUF.id).subscribe(
      (cities) => {
        this.loading.dismiss();
        this.cities = cities;
      },
      (error) => {
        this.loading.dismiss();
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
        console.info('Send this as user', params);
      } else {
        console.info('Send this as seller', params);
      }
    }
  }

  areEqual(control: FormGroup): void {
    let valid = false;
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

}
