import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { JSON_URL, API_URL } from '../../config';

@Injectable()
export class SellersService {

  constructor(
    private http: Http
  ) {}

  findSeller(sellerName: string) {
    let options = new RequestOptions({
      search: new URLSearchParams('name='+sellerName)
    });
    return this.http.get(API_URL + 'sellers', options).map(res => res.json());
  }

  getAll() {
    return this.http.get(API_URL + 'sellers').map(res => res.json());
  }
}
