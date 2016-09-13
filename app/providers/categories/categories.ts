import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { JSON_URL, API_URL } from '../../config';

@Injectable()
export class CategoriesService {

  constructor(
    private http: Http
  ) {
  }

  getAll () {
    return this.http.get(API_URL + 'categories').map(res => res.json());
  }

}
