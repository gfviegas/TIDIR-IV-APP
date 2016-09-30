import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { API_URL } from '../../app/config';

export interface SellerObject {
  _id: string;
  updatedAt: string;
  createdAt: string;
  name: string;
  email: string;
  password?: string;
  contact?: {
    whatsapp?: string;
    facebook?: string;
    phone?: string;
  };
  photo: string;
  location: {
    city: string
    state: string
  };
  category: string[];
  products?: number;
};

export class Seller implements SellerObject {
  _id = '';
  updatedAt = '';
  createdAt = '';
  name = '';
  email = '';
  followedSellers = [];
  photo = '';
  location = {
    city: '',
    state: ''
  };
  category = [];
}

@Injectable()
export class SellersService {

  constructor(
    public http: Http
  ) {}

  /**
   * Find a seller by his name
   * @method findSeller
   * @param  {string}   sellerName The name to query
   * @return {Observable}          HTTP Observable of query result
   */
  findSeller(sellerName: string): Observable<Array<SellerObject>> {
    let options = new RequestOptions({
      search: new URLSearchParams('name='+sellerName)
    });
    return this.http.get(API_URL + 'sellers', options).map(res => res.json());
  }

  /**
   * Get all Seller and optionally filter the dataset
   * @method getAll
   * @param  {object} filters The filter key-value object to match API key-value
   * @return {Observable}         The HTTP request of query result
   */
  getAll(filters?): Observable<Array<SellerObject>> {
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

    return this.http.get(API_URL + 'sellers', options).map(res => res.json());
  }

  /**
   * Get a seller by his Id
   * @method getById
   * @param  {string} sellerId The ID of the seller to be found
   * @return {Observable}          The HTTP GET Request Observable
   */
  getById(sellerId: string): Observable<SellerObject> {
    return this.http.get(API_URL + 'sellers/' + sellerId).map(res => res.json());
  }

  /**
   * Get the products of a specific seller
   * @method getProducts
   * @param  {string}    sellerId The seller ID
   * @return {Observable}             THe HTTP GET Request Observable
   */
  getProducts(sellerId: string): Observable<Array<any>> {
    return this.http.get(API_URL + 'sellers/' + sellerId + '/products').map(res => res.json());
  }
}
