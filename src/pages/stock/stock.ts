import { Component } from '@angular/core';
import { NavController, PopoverController, ToastController } from 'ionic-angular';

import { UpdateStockPage } from './popovers/update/update';

import { ProductObject, Product } from '../../providers/products/products';
import { SellersService } from '../../providers/sellers/sellers';
import { AuthService } from '../../providers/auth/auth';

@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html'
})
export class StockPage {

  sellerId: string;
  products: Array<ProductObject> = [];
  loading: boolean = false;

  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public sellersService: SellersService,
    public authService: AuthService
  ) {
    this.sellerId = authService.getLoggedUserId();
  }

  ionViewDidEnter() {
    this.loadInit();
  }

  loadInit(): void {
    this.loading = true;


    this.sellersService.getProducts(this.sellerId).subscribe(
      products => {
        this.products = products;
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.error(error);
      }
    );

  }

  presentUpdatePopover(event, product) {
    let popover = this.popoverCtrl.create(UpdateStockPage, {
      product: product,
      sellerId: this.sellerId
    });
    popover.onDidDismiss(
      (response) => {
        if (response.updated) {
          let toast = this.toastCtrl.create({
            message: 'Estoque atualizado com sucesso!',
            position: 'top',
            showCloseButton: true,
            closeButtonText: 'Fechar',
            duration: 3500
          });
          toast.present();
          let updatedProduct = this.products.find(p => p == product);
          updatedProduct.stock_avaible = response.product.stock_avaible;
          updatedProduct.stock_reserved = response.product.stock_reserved;
        }
      }
    )
    popover.present({
      ev: event
    });
  }

}
