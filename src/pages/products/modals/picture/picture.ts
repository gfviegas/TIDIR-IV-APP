import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { Platform, ViewController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { ProductsService } from '../../../../providers/products/products';

import { IMG_URL } from '../../../../app/config';

@Component({
  templateUrl: 'picture.html'
})
export class ProductPicturesPage {
  base64Image = '';

  product;
  images = [];
  imageURL: SafeUrl;

  constructor(
    public viewCtrl: ViewController,
    public platform: Platform,
    public productsService: ProductsService,
    public sanitizer: DomSanitizer,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public params: NavParams
  ) {
    this.product = params.get('product');
    this.images = this.product.images;
  }

  trustUrl(image) {
    return this.sanitizer.bypassSecurityTrustUrl(IMG_URL + image);
  }

  dismiss() {
    return this.viewCtrl.dismiss(this.images);
  }

  fileChanged(event) {
    this.upload(event.srcElement.files[0]);
    let imageURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.srcElement.files[0]));
    this.images.push(imageURL);
  }

  upload(image) {

    let loading = this.loadingCtrl.create({
      content: 'Carregando'
    });
    loading.present();

    this.productsService.addPicture(this.product._id, image).then(
      (response) => {
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Imagem adicionada com sucesso!',
          position: 'top',
          showCloseButton: true,
          closeButtonText: 'Fechar',
          duration: 4500
        });
        toast.present();

        this.images = response;
      },
      (error) => {
        console.error(error);
        loading.dismiss();
      }
    );

  }

  deleteImage(image) {
    this.productsService.deletePicture(this.product._id, image).subscribe(
      (success) => {
        let deletedImage = this.images.find(i => i == image);
        let index = this.images.indexOf(deletedImage, 0);
        if (index > -1) {
          this.images.splice(index, 1);
        }

        let toast = this.toastCtrl.create({
          message: 'Imagem excluída com sucesso!',
          position: 'top',
          showCloseButton: true,
          closeButtonText: 'Fechar',
          duration: 4500
        });
        toast.present();

      }
    )
  }

  getImage() {
    document.getElementById('imageInput').click();
  }

}
