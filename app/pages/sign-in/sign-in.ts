import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { REACTIVE_FORM_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../providers/auth/auth';
import { SignService } from '../../providers/sign/sign';

@Component({
  templateUrl: 'build/pages/sign-in/sign-in.html',
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
  providers: [SignService]
})
export class SignInPage {


  signInForm: FormGroup;
  passwords: AbstractControl;
  location: AbstractControl;
  name: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  confirm: AbstractControl;
  state: AbstractControl;
  city: AbstractControl;
  formSubmitted: boolean = false;

  ufs: any;
  cities: any;

  constructor(
    private fb: FormBuilder,
    private signService: SignService,
    private navCtrl: NavController
  ) {
    this.signInForm = fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      passwords:  fb.group({
        password: ['', Validators.required],
        confirm: ['', Validators.required]
      }, {validator: this.areEqual}),
      location: fb.group({
        state: ['', Validators.required],
        city: ['', Validators.required]
      })
    });
    this.name = this.signInForm.controls['name'];
    this.email = this.signInForm.controls['email'];

    this.passwords = this.signInForm.controls['passwords'];
    this.password = this.signInForm.controls['passwords']['controls']['password'];
    this.confirm = this.signInForm.controls['passwords']['controls']['confirm'];

    this.location = this.signInForm.controls['location'];
    this.state = this.signInForm.controls['location']['controls']['state'];
    this.city = this.signInForm.controls['location']['controls']['city'];
  }

  ngOnInit() {
    this.signService.getUfs().subscribe(
      (data) => {
        console.log(data);
        this.ufs = data;
      }
    );
  }

  getCities() {
    let selectedUF = this.ufs[this.state.value];
    this.signService.getCities(selectedUF.id).subscribe(
      (cities) => {
        this.cities = cities;
      }
    );
  }

  signIn() {
    console.log(this.signInForm);
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

}
