import { Component } from '@angular/core';
import { NavController, Toast, LoadingController, AlertController } from 'ionic-angular';
import { REACTIVE_FORM_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TabsPage } from '../tabs/tabs';

@Component ({
    templateUrl: 'build/pages/login/login.html',
    directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})
export class LoginPage {

    type: string = 'client';

    clientLoginForm: FormGroup;
    clientEmail: AbstractControl;
    clientPassword: AbstractControl;
    clientFormSubmitted: boolean = false;

    sellerLoginForm: FormGroup;
    sellerEmail: AbstractControl;
    sellerPassword: AbstractControl;
    sellerFormSubmitted: boolean = false;

    constructor (
        private navCtrl: NavController,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private fb: FormBuilder,
        private authService: AuthService
    ) {
        this.clientLoginForm = fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.clientEmail = this.clientLoginForm.controls['email'];
        this.clientPassword = this.clientLoginForm.controls['password'];

        this.sellerLoginForm = fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.sellerEmail = this.sellerLoginForm.controls['email'];
        this.sellerPassword = this.sellerLoginForm.controls['password'];
    }

    clientLogin () {
        this.clientFormSubmitted = true;
        if (this.clientLoginForm.valid) {
            console.log(this.clientLoginForm);
            let userEmail = this.clientLoginForm.value.email;
            let userPassword = this.clientLoginForm.value.password;
            let loading = this.loadingCtrl.create({
                content: 'Carregando...'
            });
            loading.present();

            this.authService.login(userEmail, userPassword, 'user').subscribe(
                success => {
                    loading.dismiss();
                    this.presentAlert('Sucesso!', 'Autenticado com sucesso!');
                    this.navCtrl.setRoot(TabsPage);
                },
                error => {
                    loading.dismiss();
                    let errorMessage = JSON.parse(error._body).error;

                    if (error.status === 422 && errorMessage === 'user_not_found') {
                        this.presentAlert('Erro!', 'Usuário não encontrado, verifique seu email e tente novamente!');
                    } else if (error.status === 422 && errorMessage === 'wrong_credentials') {
                        this.presentAlert('Erro!', 'Credenciais inváidas, verifique sua senha e tente novamente!');
                    }
                }
            );;
        }
    }

    sellerLogin () {
        this.sellerFormSubmitted = true;
        if (this.sellerLoginForm.valid) {
            console.log(this.sellerLoginForm);
            let userEmail = this.sellerLoginForm.value.email;
            let userPassword = this.sellerLoginForm.value.password;
            let loading = this.loadingCtrl.create({
                content: 'Carregando...'
            });
            loading.present();

            this.authService.login(userEmail, userPassword, 'seller').subscribe(
                success => {
                    loading.dismiss();
                    this.presentAlert('Sucesso!', 'Autenticado com sucesso!');
                    this.navCtrl.setRoot(TabsPage);
                },
                error => {
                    loading.dismiss();
                    let errorMessage = JSON.parse(error._body).error;

                    if (error.status === 422 && errorMessage === 'user_not_found') {
                        this.presentAlert('Erro!', 'Usuário não encontrado, verifique seu email e tente novamente!');
                    } else if (error.status === 422 && errorMessage === 'wrong_credentials') {
                        this.presentAlert('Erro!', 'Credenciais inváidas, verifique sua senha e tente novamente!');
                    }
                }
            );;
        }
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
