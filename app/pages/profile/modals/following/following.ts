import { Component } from '@angular/core';
import { NavController, ViewController, AlertController, LoadingController, ModalController } from 'ionic-angular';

import {IMG_URL} from '../../../../config.ts';
import { SellerObject } from '../../../../providers/sellers/sellers';
import { UsersService } from '../../../../providers/users/users';
import { SellerPage } from '../../../seller/seller';

@Component({
  templateUrl: 'build/pages/profile/modals/following/following.html',
  providers: [UsersService]
})
export class FollowingPage {

  IMG_URL: string = IMG_URL;

  followers: Array<SellerObject> = [];
  loading: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private usersService: UsersService
  ) {
  }

  ionViewDidEnter() {
    this.loadInit();
  }

  loadInit(): void {
    this.loading = true;
    this.usersService.getFollowedSellers().subscribe(
      followers => {
        console.log(followers);
        this.followers = followers;
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.error(error);
      }
    );
  }

  dismiss() {
    return this.viewCtrl.dismiss(this.followers);
  }

  showSeller(seller) {
    this.navCtrl.setRoot(SellerPage, {id : seller._id}).then(
      () => {
        this.dismiss();
      }
    );
  }

  confirmUnfollow(seller: SellerObject) {
    let confirm = this.alertCtrl.create({
      title: 'Parar de Seguir',
      message: `Você realmente deseja parar de seguir ${seller.name.split(' ')[0]}?`,
      buttons: [
        {
          text: 'Não'
        },
        {
          text: 'Sim',
          handler: () => {
            this.unfollow(seller);
          }
        }
      ]
    });
    confirm.present();
  }

  unfollow(seller: SellerObject) {
    this.usersService.unfollowSeller(seller._id).subscribe(
      response => {
        let index = this.followers.indexOf(seller, 0);
        if (index > -1) {
          this.followers.splice(index, 1);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

}
