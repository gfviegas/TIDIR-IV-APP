import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { API_URL } from '../../app/config';

export interface ProductObject {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  seller: {
    _id: string;
    name: string;
    photo?: string;
    location: {
      city?: string;
      state?: string;
    }
  };
  stock_reserved: number;
  stock_avaible: number;
  favorite: boolean;
  images: string[];
};

export class Product implements ProductObject {
  _id = '';
  name = '';
  description = '';
  price = 0;
  category = '';
  seller = {
    _id : '',
    name : '',
    location: {
      city: '',
      state: '',
    }
  };
  stock_reserved = 0;
  stock_avaible = 0;
  favorite = false;
  images = [];
}

@Injectable()
export class ProductsService {

  constructor(
    public http: AuthHttp
  ) {
  }

  /**
   * Find a seller by his name
   * @method findSeller
   * @param  {string}   sellerName The name to query
   * @return {Observable}          HTTP Observable of query result
   */
  findProduct(productName: string, sellerId?: string): Observable<Array<ProductObject>> {
    let options = new RequestOptions({
      search: new URLSearchParams('name='+productName)
    });
    let url = API_URL + 'products';
    if (sellerId) {
      url = API_URL + 'sellers/' + sellerId + '/products';
    }

    return this.http.get(url, options).map(res => res.json());
  }

  /**
   * Get all Products and optionally filter the dataset
   * @method getAll
   * @param  {object} filters The filter key-value object to match API key-value
   * @return {Observable}         The HTTP request of query result
   */
  getAll(filters?): Observable<Array<ProductObject>> {
    let params = new URLSearchParams();

    for (let key in filters) {
      if (key == 'sort') {
        params.set(key, filters[key].value);
      } else if (filters[key] != '') {
        params.set(key, JSON.stringify(filters[key]));
      }
    }

    let options = new RequestOptions({
      search: params
    });

    return this.http.get(API_URL + 'products', options).map(res => res.json());
  }

  /**
   * Get a product by his Id
   * @method getById
   * @param  {number} productId The ID of the Product to be found
   * @return {Observable}          The HTTP GET Request Observable
   */
  getById(productId: string): Observable<ProductObject> {
    return this.http.get(API_URL + 'products/' + productId).map(res => res.json());
  }

  updateStock(productId: string, avaible: number, reserved: number): Observable<ProductObject> {
    return this.http.put(API_URL + 'products/' + productId, {stock_avaible: avaible, stock_reserved: reserved}).map(res => res.json());
  }

  createProduct(params: any): Observable<ProductObject> {
    return this.http.post(API_URL + 'products/', params).map(res => res.json());
  }

  updateProduct(productId: string, params: any): Observable<ProductObject> {
    return this.http.put(API_URL + 'products/' + productId, params).map(res => res.json());
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(API_URL + 'products/' + productId);
  }
}
