import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, ModalController, LoadingController } from 'ionic-angular';
import { IMG_URL } from '../../app/config';
import moment from 'moment';
import { Subscription } from 'rxjs/Subscription';

import { AuthService, UserObject, AuthUser } from '../../providers/auth/auth';
import { UsersService } from '../../providers/users/users';

import { LoginPage } from '../login/login';
import { FollowingPage } from './modals/following/following';
import { TermsPage } from './modals/terms/terms';
import { EditUserPage } from './modals/edit/edit';

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
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public userService: UsersService
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

  presentTermsModal(): void {
    let modal = this.modalCtrl.create(TermsPage);
    modal.present();
  }

  editData(): void {
    let modal = this.modalCtrl.create(EditUserPage, {user: this.user});
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

  // presentEditName(): void {
  //   let prompt = this.alertCtrl.create({
  //     title: 'Editar Nome',
  //     message: "Atualize o seu nome. Digite no máximo 30 caracteres.",
  //     inputs: [{
  //       name: 'name',
  //       placeholder: 'Nome',
  //       value: this.user.name
  //     }],
  //     buttons: [
  //       { text: 'Cancelar' },
  //       {
  //         text: 'Salvar',
  //         handler: data => {
  //           if (data.name !== '') {
  //             this.updateData('name', data.name).then(
  //               value => {
  //                 if (value.name) {
  //                   this.user.name = value.name;
  //                 }
  //               }
  //             );
  //           } else {
  //             let toast = this.toastCtrl.create({
  //               message: 'Dado inválido!',
  //               duration: 3000
  //             });
  //             toast.present();
  //             this.presentEditName();
  //           }
  //         }
  //       }
  //     ]
  //   });
  //   prompt.present();
  // }
  //
  // updateData(field: string, newValue: any): Promise<UserObject> {
  //   let toast = this.toastCtrl.create({
  //     message: 'Dado atualizado com sucesso!',
  //     position: 'top',
  //     showCloseButton: true,
  //     closeButtonText: 'Fechar',
  //     duration: 3000
  //   });
  //
  //   return new Promise((resolve, reject) => {
  //     this.userService.update(field, newValue).subscribe(
  //       user => {
  //         toast.present();
  //         resolve(user);
  //       },
  //       error => {
  //         reject(error);
  //       }
  //     );
  //   });
  //
  // }
}
