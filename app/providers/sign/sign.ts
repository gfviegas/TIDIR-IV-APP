import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {JSON_URL} from '../../config';

@Injectable()
export class SignService {

  constructor(
    private http: Http
  ) {
  }

  getUfs() {
    return this.http.get(JSON_URL + 'ufs/ufs.json').map(res => res.json());
  }

  getCities(ufId: number) {
    return this.http.get(JSON_URL + 'ufs/' + ufId + '/cities.json').map(res => res.json());
  }

}
