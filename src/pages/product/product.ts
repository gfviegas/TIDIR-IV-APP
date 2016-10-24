import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, AlertController, ToastController } from 'ionic-angular';

import { IMG_URL } from '../../app/config';

import { ProductObject, Product, ProductsService } from '../../providers/products/products';

// import { ImageViewerDirective } from 'ionic-img-viewer';
import { SellerPage } from '../seller/seller';
import { CreateProductPage } from '../products/modals/create/create';
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
    public productsService: ProductsService
  ) {
    this.product = this.params.get('product');
    this.sellerPage = this.params.get('sellerPage');
    this.seller = this.params.get('seller');
    console.log(this.params);
  }

  showSeller(): void {
    this.navCtrl.push(SellerPage, {id : this.product.seller._id});
  }

  checkSeller(): boolean {
    return !(this.sellerPage || (this.seller.name.length > 0));
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