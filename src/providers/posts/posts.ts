import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { API_URL } from '../../app/config';

export interface PostObject {
  _id: string;
  updatedAt: string,
  createdAt: string,
  content: string,
  author: string,
};

@Injectable()
export class PostsService {

  constructor(
    public http: AuthHttp
  ) {
  }

  getUserFollowedSellersPosts(userId): Observable<Array<any>> {
    return this.http.get(API_URL + 'users/' + userId + '/followers/posts').map(res => res.json());
  }

}
