import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { JwtHelper, AuthHttp } from 'angular2-jwt';

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

  public jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    public http: AuthHttp
  ) {}

  getSellerId(): string {
    return this.jwtHelper.decodeToken(localStorage.getItem('id_token')).sub;
  }

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
        params.set(key, JSON.stringify(filters[key]));
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

  uploadPicture(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let sellerId = this.getSellerId();
      let http = new XMLHttpRequest();

      let formData = new FormData();
      formData.append('file', file, file.name);
      http.open('PUT', API_URL + 'sellers/' + sellerId + '/image', true);
      http.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('id_token'));
      http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      http.onreadystatechange = function() {
        if(http.readyState == 4) {
          if (http.status === 200) {
            resolve(JSON.parse(http.response));
          } else {
            reject(http.response);
          }
        }
      }

      http.send(formData);

    });
  }

  update(values: any) :Observable<SellerObject> {
    let params = values;
    return this.http.put(API_URL + 'sellers/' + this.getSellerId(), params).map(res => res.json());
  }

  deleteSeller(): Observable<any> {
    return this.http.delete(API_URL + 'sellers/' + this.getSellerId());
  }
}
