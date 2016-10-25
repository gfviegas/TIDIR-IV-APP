import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { Platform, ViewController, NavParams, LoadingController } from 'ionic-angular';

import { Camera, CameraOptions, Transfer, FileUploadOptions } from 'ionic-native';

import { UsersService } from '../../../../providers/users/users';
import { SellersService } from '../../../../providers/sellers/sellers';

import { IMG_URL, API_URL } from '../../../../app/config';

@Component({
  templateUrl: 'picture.html'
})
export class PicturePage {
  base64Image = '';
  image;
  imageURL: SafeUrl;
  userType: string;

  constructor(
    public viewCtrl: ViewController,
    public platform: Platform,
    public sellersService: SellersService,
    public usersService: UsersService,
    public sanitizer: DomSanitizer,
    public loadingCtrl: LoadingController,
    public params: NavParams
  ) {
    this.imageURL =  sanitizer.bypassSecurityTrustUrl(IMG_URL + this.params.get('photo'));
    this.userType = this.params.get('userType');
  }

  dismiss() {
    return this.viewCtrl.dismiss();
  }

  fileChanged(event) {
    this.image = event.srcElement.files[0];
    this.imageURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.image));
  }

  submit() {
    if (this.image) {

      let loading = this.loadingCtrl.create({
        content: 'Carregando'
      });
      loading.present();
      if (this.userType === 'seller') {
        this.sellersService.uploadPicture(this.image).then(
          (response) => {
            this.viewCtrl.dismiss(response.photo + '?_ts=' + new Date().getTime());
            loading.dismiss();
          },
          (error) => {
            console.error(error);
            loading.dismiss();
          }
        );
      } else {
        this.usersService.uploadPicture(this.image).then(
          (response) => {
            this.viewCtrl.dismiss(response.photo + '?_ts=' + new Date().getTime());
            loading.dismiss();
          },
          (error) => {
            console.error(error);
            loading.dismiss();
          }
        );
      }
    }
  }

  getImage() {
    document.getElementById('imageInput').click();
  }

}
