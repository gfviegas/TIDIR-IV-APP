import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { NavController, NavParams, LoadingController, ModalController, AlertController, ToastController } from 'ionic-angular';

import { IMG_URL } from '../../app/config';

import { ProductObject, Product, ProductsService } from '../../providers/products/products';

// import { ImageViewerDirective } from 'ionic-img-viewer';
import { SellerPage } from '../seller/seller';
import { CreateProductPage } from '../products/modals/create/create';
import { ProductPicturesPage } from '../products/modals/picture/picture';
import { ProductsPage } from '../products/products';

@Component({
  templateUrl: 'product.html',
})
export class ProductPage {

  IMG_URL: string = IMG_URL;
  sellerPage: boolean = false;
  seller:any = {};
  slideOptions = {
    pager: true,
    initialSlide: 0,
    loop: true,
    autoplay: 3500,
    autoplayDisableOnInteraction: true
  };
  product: ProductObject = new Product();

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public params: NavParams,
    public productsService: ProductsService,
    public sanitizer: DomSanitizer
  ) {
    this.product = this.params.get('product');
    this.sellerPage = this.params.get('sellerPage');
    this.seller = this.params.get('seller');
  }

  showSeller(): void {
    this.navCtrl.push(SellerPage, {id : this.product.seller._id});
  }

  checkSeller(): boolean {
    let nameLength: number = this.seller.name.length;
    return !(this.sellerPage || (nameLength > 0));
  }

  checkImagesLength(): boolean {
    if (this.product && this.product.images) {
      let imagesLength: number = this.product.images.length;
      return (imagesLength > 0);
    } else {
      return false;
    }
  }

  trustUrl(image) {
    return this.sanitizer.bypassSecurityTrustUrl(IMG_URL + image);
  }

  editProduct(): void {
    let modal = this.modalCtrl.create(CreateProductPage, {product: this.product});
    modal.onDidDismiss(data => {
      if (data.updated) {
        this.product = data.product;
      }
    });
    modal.present();
  }

  presentConfirmDelete(): void {
    let confirm = this.alertCtrl.create({
      title: 'Excluir Produto',
      message: `Você realmente deseja excluir este produto?`,
      buttons: [
        {
          text: 'Não'
        },
        {
          text: 'Sim',
          handler: () => {
            this.deleteProduct();
          }
        }
      ]
    });
    confirm.present();
  }

  presentPictureModal(): void {
    let modal = this.modalCtrl.create(ProductPicturesPage, {product: this.product});
    modal.onDidDismiss(data => {
      this.product.images = data;
    });
    modal.present();
  }

  deleteProduct(): void {
    this.productsService.deleteProduct(this.product._id).subscribe(
      (success) => {
        let toast = this.toastCtrl.create({
          message: 'Produto excluído com sucesso!',
          position: 'top',
          showCloseButton: true,
          closeButtonText: 'Fechar',
          duration: 3500
        });
        toast.present();

        this.navCtrl.setRoot(ProductsPage);
      }
    );
  }

}
