import { Injectable } from '@angular/core';
import { AuthHttp, tokenNotExpired, JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import { JSON_URL, API_URL } from '../../config';

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
    private http: AuthHttp
  ) {
  }

  getUserFollowedSellersPosts(userId) {
    return this.http.get(API_URL + 'users/' + userId + '/followers/posts').map(res => res.json());
  }

}
