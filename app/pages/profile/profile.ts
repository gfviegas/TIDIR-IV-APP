import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import {AuthService} from '../../services/auth.service';
import {IMG_URL} from '../../config.ts';
import {LoginPage} from '../login/login';
import * as moment from 'moment';


@Component({
  templateUrl: 'build/pages/profile/profile.html',
})
export class ProfilePage {

    IMG_URL: string = IMG_URL;
    user: Object = {
        "_id": "",
        "updatedAt": "",
        "createdAt": "",
        "name": "",
        "age": null,
        "email": "",
        "password": "",
        "contact": {
            "whatsapp": "",
            "facebook": "",
            "phone": ""
        },
        "followedSellers": [],
        "photo": "",
        "location": {
            "city": "",
            "state": ""
        }
    };
    createdFromNow: string;
    page: string = 'overview';
    loading: any;


  constructor(
      private navCtrl: NavController,
      private authService: AuthService,
      private alertCtrl: AlertController,
      private loadingCtrl: LoadingController
  ) {
      this.loading = loadingCtrl.create({
        content: "Carregando..."
      });
  }

  ngOnInit() {
      this.loading.present();
      this.authService.getLoggedUserData().subscribe(
          (user) => {
              this.user = user;
              this.createdFromNow = moment(user.createdAt).fromNow();
              this.loading.dismiss();
          },
          (error) => {
              console.log(error);
              this.loading.dismiss();
          }
      );
  }

  logout() {
      if (this.authService.logout()) {
          this.presentLoggedOutAlert();
          this.navCtrl.setRoot(LoginPage);
      }
  }

  presentLoggedOutAlert() {
      let alert = this.alertCtrl.create({
          title: 'Desconectado',
          subTitle: 'Você foi desconectado do sistema com sucesso',
          buttons: ['OK']
      });
      alert.present();
  }
}
