import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { JSON_URL, API_URL } from '../../app/config';

@Injectable()
export class SignService {

  constructor(
    public http: Http
  ) {
  }

  getUfs(): Observable<any> {
    return this.http.get(JSON_URL + 'ufs/ufs.json').map(res => res.json());
  }

  getCities(ufId: number): Observable<any> {
    return this.http.get(JSON_URL + 'ufs/' + ufId + '/cities.json').map(res => res.json());
  }

  checkIfEmailExists(reqEmail: string): Observable<any> {
    return this.http.get(API_URL + 'users/check/' + reqEmail).map(res => res.json());
  }

  signUser(reqData: any): Observable<any> {
    return this.http.post(API_URL + 'users', reqData).map(res => res.json());
  }

  signSeller(reqData: any): Observable<any> {
    return this.http.post(API_URL + 'sellers', reqData).map(res => res.json());
  }

}
