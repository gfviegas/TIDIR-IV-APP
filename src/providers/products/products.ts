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
  findProduct(productName: string): Observable<Array<ProductObject>> {
    let options = new RequestOptions({
      search: new URLSearchParams('name='+productName)
    });
    return this.http.get(API_URL + 'products', options).map(res => res.json());
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
        params.set(key, filters[key]);
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
  getById(productId: number): Observable<ProductObject> {
    return this.http.get(API_URL + 'products/' + productId).map(res => res.json());
  }
}
