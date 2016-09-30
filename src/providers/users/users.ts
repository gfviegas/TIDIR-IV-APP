import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { API_URL } from '../../app/config';

import { SellerObject } from '../sellers/sellers';

export interface UserObject {
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
  followedSellers: number[];
  photo: string;
  location: {
    city: string
    state: string
  };
};

export class User implements UserObject {
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
}

@Injectable()
export class UsersService {

  public jwtHelper: JwtHelper = new JwtHelper();
  public userId: string;

  constructor(
    public http: Http,
    public local: Storage
  ) {
    this.userId = this.jwtHelper.decodeToken(localStorage.getItem('id_token')).sub;
  }

  getFollowedSellers(): Observable<Array<SellerObject>> {
    return this.http.get(API_URL + 'users/' + this.userId + '/followers').map(res => res.json());
  }

  checkFollowingSeller(sellerId: string): Observable<any> {
    return this.http.get(API_URL + 'users/' + this.userId + '/followers/check/' + sellerId).map(res => res.json());
  }

  followSeller(sellerId: string): Observable<any> {
    return this.http.post(API_URL + 'users/' + this.userId + '/followers', {seller: sellerId}).map(res => res.json());
  }

  unfollowSeller(sellerId: string): Observable<any> {
    return this.http.delete(API_URL + 'users/' + this.userId + '/followers/' + sellerId).map(res => res.json());
  }

}
