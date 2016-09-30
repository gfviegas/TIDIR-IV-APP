import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { IMG_URL } from '../../app/config';
import moment from 'moment';

import { AuthService, UserObject, AuthUser } from '../../providers/auth/auth';

import { LoginPage } from '../login/login';
import { FollowingPage } from './modals/following/following';

@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage {

  IMG_URL: string = IMG_URL;
  user: UserObject = new AuthUser();
  createdFromNow: string;
  page: string = 'overview';


  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController
  ) {
  }

  ionViewDidEnter() {
    let loading = this.loadingCtrl.create({
      content: "Carregando..."
    });

    loading.present();
    this.authService.getLoggedUserData().subscribe(
      (user) => {
        this.user = user;
        this.createdFromNow = moment(user.createdAt).fromNow();
        loading.dismiss();
      },
      (error) => {
        console.log(error);
        loading.dismiss();
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

  presentFollowingModal() {
    let modal = this.modalCtrl.create(FollowingPage);
    modal.onDidDismiss(data => {
      this.user.followedSellers = data;
    });
    modal.present();
  }
}
