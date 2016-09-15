import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp, tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Storage, LocalStorage } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { JSON_URL, API_URL } from '../../config';

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

  private local: Storage;
  private jwtHelper: JwtHelper = new JwtHelper();
  private userId: string;

  constructor(
    private http: AuthHttp
  ) {
    this.local = new Storage(LocalStorage);
    this.userId = this.jwtHelper.decodeToken(localStorage.getItem('id_token')).sub;
  }

  checkFollowingSeller(sellerId: string) {
    return this.http.get(API_URL + 'users/' + this.userId + '/followers/check/' + sellerId).map(res => res.json());
  }

  followSeller(sellerId: string) {
    return this.http.post(API_URL + 'users/' + this.userId + '/followers', {seller: sellerId}).map(res => res.json());
  }

  unfollowSeller(sellerId: string) {
    return this.http.delete(API_URL + 'users/' + this.userId + '/followers/' + sellerId).map(res => res.json());
  }

}
