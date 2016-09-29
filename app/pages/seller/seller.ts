import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { SocialSharing } from 'ionic-native';

import {IMG_URL} from '../../config.ts';
import { SellersService, SellerObject, Seller } from '../../providers/sellers/sellers';
import { UsersService } from '../../providers/users/users';

import { ProductsPage } from '../products/products';

@Component({
  templateUrl: 'build/pages/seller/seller.html',
  providers: [SellersService, UsersService]
})
export class SellerPage {

  IMG_URL: string = IMG_URL;
  seller: SellerObject = new Seller();
  createdFromNow: string;
  following: boolean = false;

  constructor(
    public params: NavParams,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private usersService: UsersService,
    private sellersService: SellersService
  ) {
  }

  ngOnInit() {
    this.loadInit();
  }

  ionViewDidLeave() {
    this.navCtrl.popToRoot();
  }

  loadInit(): void {
    let loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loading.present();

    let sellerId = this.params.get('id');

    this.sellersService.getById(sellerId).subscribe(
      seller => {
        this.seller = seller;
        this.createdFromNow = moment(seller.createdAt).fromNow();
        loading.dismiss();
      },
      error => {
        console.error(error);
        loading.dismiss();
      }
    );
    this.usersService.checkFollowingSeller(sellerId).subscribe(
      result => {
        console.log(result.following);
        this.following = result.following;
      },
      error => {
        console.error(error);
      }
    );

  }

  mail(email: string) {
    window.open(`mailto:${email}`, '_system');
  }

  call(number: any) {
    let filteredNumber = `tel:+55${number.match(/\d/g).join('')}`;
    return filteredNumber;
  }

  chat(number: any) {
    // window.open(`tel:${number}`, '_system');
    let filteredNumber = `+55${number}`.trim();
    SocialSharing.shareViaWhatsAppToReceiver(filteredNumber, '')
      .then(
        () => {
          console.log('ok');
        }
      )
      .catch(
        () => {
          console.log('impossible to open wpp')
        }
      );
  }

  presentProductsModal() {
    this.navCtrl.push(ProductsPage, {seller: this.seller});
  }

  confirmFollow() {
    let confirm = this.alertCtrl.create({
      title: 'Seguir',
      message: `Você realmente deseja seguir ${this.seller.name.split(' ')[0]}?`,
      buttons: [
        {
          text: 'Não'
        },
        {
          text: 'Sim',
          handler: () => {
            this.follow();
          }
        }
      ]
    });
    confirm.present();
  }

  confirmUnfollow() {
    let confirm = this.alertCtrl.create({
      title: 'Parar de Seguir',
      message: `Você realmente deseja parar de seguir ${this.seller.name.split(' ')[0]}?`,
      buttons: [
        {
          text: 'Não'
        },
        {
          text: 'Sim',
          handler: () => {
            this.unfollow();
          }
        }
      ]
    });
    confirm.present();
  }

  follow() {
    this.usersService.followSeller(this.seller._id).subscribe(
      response => {
        this.following = true;
      },
      error => {
        console.error(error);
      }
    );
  }

  unfollow() {
    this.usersService.unfollowSeller(this.seller._id).subscribe(
      response => {
        this.following = false;
      },
      error => {
        console.error(error);
      }
    );
  }

}
