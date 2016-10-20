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

  /**
  * Gets the posts from a sellerId
  * @method getPosts
  * @param  {String} sellerId Seller ID
  */
  getPosts(sellerId: string): Observable<Array<PostObject>> {
    return this.http.get(API_URL + 'sellers/' + sellerId + '/posts').map(res=> res.json());
  }

  /**
   * Creates a post with a content in a seller context
   * @method createPost
   * @param  {String}          sellerId Seller ID
   * @param  {String}          content  Content of the Posts
   */
  createPost(sellerId: string, content: string): Observable<any> {
    return this.http.post(API_URL + 'sellers/' + sellerId + '/posts', {content: content}).map(res => res.json());
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(API_URL + 'posts/' + postId);
  }

}
