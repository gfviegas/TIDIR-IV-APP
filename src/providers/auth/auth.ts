import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Storage } from '@ionic/storage';
import { API_URL } from '../../app/config';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

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

export class AuthUser implements UserObject {
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
export class AuthService {

  public loggedIn: boolean;

  public jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    public http: Http,
    public local: Storage
  ) {
    this.loggedIn = tokenNotExpired();
  }

  /**
  * Send a request to API Auth Route to get a JWT
  * @method login
  * @param  {String} email    The user target email
  * @param  {String} password The user target password
  * @param  {String} type     The type of login - user or seller
  * @return {Observable}      The auth HTTP observable
  */
  login(email: string, password: string, type: string): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http
    .post(
      API_URL + '/auth/' + type,
      JSON.stringify({ email, password }),
      { headers }
    )
    .map(res => res.json())
    .map((res) => {
      if (res.token) {
        window.localStorage.setItem('id_token', res.token);
        this.local.set('id_token', res.token);
      }
    });
  }

  logout(): boolean {
    window.localStorage.removeItem('id_token');
    this.local.remove('id_token');
    return true;
  }

  isLoggedIn(): any {
    console.log(window.localStorage);
    return tokenNotExpired();
  }

  checkIfExpired(token) {
    return tokenNotExpired(token);
  }

  getLoggedUserId(): any {
    return this.jwtHelper.decodeToken(window.localStorage.getItem('id_token')).sub;
    // return this.local.get('id_token').then(
    //   (token) => {
    //     return this.jwtHelper.decodeToken(token).sub;
    //   }
    // )
  }

  getLoggedUser(): any {
    return this.jwtHelper.decodeToken(window.localStorage.getItem('id_token')).user_data;
  }

  getLoggedUserData(): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let userId = this.jwtHelper.decodeToken(window.localStorage.getItem('id_token')).sub;
    let userType = this.getLoggedUser().type === 'seller' ? 'sellers' : 'users';

    return this.http.get(API_URL + userType + '/' + userId, { headers }).map(res => res.json());
  }
}
