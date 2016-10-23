import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { ProductsService, ProductObject } from '../../../../providers/products/products';

@Component({
  templateUrl: 'update.html'
})
export class UpdateStockPage {
  product: ProductObject;
  sellerId: any;

  stockForm: FormGroup;
  stockAvaible: AbstractControl;
  stockReserved: AbstractControl;
  stockFormSubmitted: boolean = false;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public fb: FormBuilder,
    public productsService: ProductsService
  ) {
    this.product = params.data.product;
    this.sellerId = params.data.sellerId;

    this.stockForm = fb.group({
      stockAvaible: [this.product.stock_avaible, Validators.required],
      stockReserved: [this.product.stock_reserved, Validators.required]
    });
    this.stockAvaible = this.stockForm.controls['stockAvaible'];
    this.stockReserved = this.stockForm.controls['stockReserved'];
  }

  submit() {
    this.stockFormSubmitted = true;
    let avaible = this.stockAvaible.value;
    let reserved = this.stockReserved.value;

    if (this.stockForm.valid) {
      this.updateStock(avaible, reserved);
    }
  }

  updateStock(avaible: number, reserved: number) {
    this.productsService.updateStock(this.product._id, avaible, reserved).subscribe(
      (response) => {
        this.viewCtrl.dismiss({updated: true, product: response});
      }
    )
  }

  exit() {
    this.viewCtrl.dismiss();
  }
}
