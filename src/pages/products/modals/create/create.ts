import { Component } from '@angular/core';
import { NavParams, ViewController, ModalController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { ProductsService, ProductObject, Product } from '../../../../providers/products/products';

import { ProductsCategoriesModalPage } from '../categories/categories';

@Component({
  templateUrl: 'create.html'
})
export class CreateProductPage {
  updateProduct: boolean = false;
  // moneyMask: any = moneyMask;

  product: ProductObject;
  sellerId: any;
  showEditForm: boolean = false;

  productForm: FormGroup;
  name: AbstractControl;
  description: AbstractControl;
  price: AbstractControl;
  category: AbstractControl;
  stock_avaible: AbstractControl;
  stock_reserved: AbstractControl;
  productFormSubmitted: boolean = false;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public fb: FormBuilder,
    public productsService: ProductsService
  ) {
    let product = params.data.product;
    if (product) {
      this.updateProduct = true;
      this.product = product;
    } else {
      this.product = new Product();
    }

    this.sellerId = params.data.sellerId;

    this.productForm = fb.group({
      name: [this.product.name, Validators.required],
      description: [this.product.description, Validators.required],
      price: [this.product.price, Validators.required],
      category: [this.product.category, Validators.required],
      stock_avaible: [this.product.stock_avaible, Validators.required],
      stock_reserved: [this.product.stock_reserved, Validators.required],
    });

    this.name = this.productForm.controls['name'];
    this.description = this.productForm.controls['description'];
    this.price = this.productForm.controls['price'];
    this.category = this.productForm.controls['category'];
    this.stock_avaible = this.productForm.controls['stock_avaible'];
    this.stock_reserved = this.productForm.controls['stock_reserved'];
  }

  presentCategoriesModal() {
    let modal = this.modalCtrl.create(ProductsCategoriesModalPage, {category: this.category.value});
    modal.onDidDismiss(data => {
     this.category.setValue(data);
   });

    modal.present();
  }

  submit() {
    this.productFormSubmitted = true;
    this.productsService.createProduct(this.productForm.value).subscribe(
      (product) => {
        let toast = this.toastCtrl.create({
          message: 'Produto cadastrado com sucesso!',
          position: 'top',
          showCloseButton: true,
          closeButtonText: 'Fechar',
          duration: 3500
        });
        toast.present();
        this.viewCtrl.dismiss({created: true, product: product});
      },
      (error) => {
        console.error(error);
      }
    )
  }

}
