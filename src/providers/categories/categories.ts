import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { API_URL } from '../../app/config';

@Injectable()
export class CategoriesService {

  constructor(
    public http: Http
  ) {
  }

  getAll(): Observable<Array<any>>  {
    return this.http.get(API_URL + 'categories').map(res => res.json());
  }

}
