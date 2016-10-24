import { Component } from '@angular/core';
import { Platform, ViewController } from 'ionic-angular';

import { Camera, CameraOptions, Transfer, FileUploadOptions } from 'ionic-native';

import { IMG_URL, API_URL } from '../../../../app/config';

@Component({
  templateUrl: 'picture.html'
})
export class PicturePage {
  base64Image = '';

  constructor(
    public viewCtrl: ViewController,
    public platform: Platform
  ) {
  }

  dismiss() {
    return this.viewCtrl.dismiss();
  }

  pickImage() {
    this.platform.ready().then(() => {
      let options: CameraOptions = {
        sourceType: 0,
        mediaType: 0,
        targetWidth: 132,
        targetHeight: 132
      };

      Camera.getPicture(options).then((imageData) => {
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        this.upload(imageData);
      }, (err) => {
        console.error(err);
      });
    });
  }

  upload(image: string): void {
    let token = '';
    let ft = new Transfer();
    let filename = 'userid' + '.jpg';
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: filename,
      mimeType: 'image/jpeg',
      chunkedMode: false,
      headers: {
        'Content-Type' : null,
        'Authorization' : 'Bearer ' + token
      },
      params: {
        fileName: filename
      }
    };
    ft.upload(image, API_URL + 'image/upload', options, false)
    .then((result: any) => {
      console.log(JSON.stringify(result));
    }).catch((error: any) => {
      console.error(JSON.stringify(error));
    });
  }
}
