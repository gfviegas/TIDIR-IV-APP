import { Component } from '@angular/core';
import { App, NavController, AlertController, ToastController, ModalController, LoadingController } from 'ionic-angular';
import { IMG_URL } from '../../app/config';
import moment from 'moment';

import { AuthService, UserObject, AuthUser } from '../../providers/auth/auth';
import { UsersService } from '../../providers/users/users';
// import { SellersService } from '../../providers/sellers/sellers';

import { LoginPage } from '../login/login';
import { FollowingPage } from './modals/following/following';
import { TermsPage } from '../terms/terms';
import { EditUserPage } from './modals/edit/edit';
import { PicturePage } from './modals/picture/picture';

@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage {

  IMG_URL: string = IMG_URL;
  user: UserObject = new AuthUser();
  userType: string;
  createdFromNow: string;
  page: string = 'overview';


  constructor(
    public app: App,
    public navCtrl: NavController,
    public authService: AuthService,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    // public sellersService: SellersService,
    public usersService: UsersService
  ) {
    this.userType = authService.getLoggedUser().type;
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
      const root = this.app.getRootNav();
      root.popToRoot();
      root.setRoot(LoginPage);
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

  presentTermsModal(): void {
    let modal = this.modalCtrl.create(TermsPage);
    modal.present();
  }

  editData(): void {
    let modal = this.modalCtrl.create(EditUserPage, {user: this.user, userType: this.userType});
    modal.onDidDismiss(data => {
      if (data) {
        let toast = this.toastCtrl.create({
          message: 'Dados atualizados com sucesso!',
          position: 'top',
          showCloseButton: true,
          closeButtonText: 'Fechar',
          duration: 3000
        });
        toast.present();
        this.user = data;
      }
    });
    modal.present();
  }

  presentPictureModal(): void {
    let modal = this.modalCtrl.create(PicturePage, {photo: this.user.photo, userType: this.userType});
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        let toast = this.toastCtrl.create({
          message: 'Imagem atualizada!',
          position: 'top',
          showCloseButton: true,
          closeButtonText: 'Fechar',
          duration: 3000
        });
        toast.present();

        this.user.photo = data;
      }
    });
    modal.present();
  }
}
