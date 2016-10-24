import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import moment from 'moment';
import 'rxjs/add/operator/map';
import { IMG_URL } from '../../app/config';

import { PostsService, PostObject } from '../../providers/posts/posts';
import { AuthService } from '../../providers/auth/auth';

import { SellerPage } from '../seller/seller';

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
  posts: Array<PostObject> = [];
  loading: boolean = false;
  IMG_URL: string = IMG_URL;

  constructor(
    public navCtrl: NavController,
    public postsService: PostsService,
    public authService: AuthService
  ) {
  }

  ionViewDidEnter() {
    this.loadInit();
  }

  loadInit(): void {
    this.loading = true;
    let userId = this.authService.getLoggedUserId();

    this.postsService.getUserFollowedSellersPosts(userId)
    .subscribe(
      (posts) => {
        posts.map((post) => {
          post.createdAt = moment(post.createdAt).fromNow();
        });

        this.posts = posts;
      }, (errors) => {
        console.error(errors);
      }, () => {
        this.loading = false;
      }
    );

    // this.postsService.getUserFollowedSellersPosts();
  }

  fromNow(dateField) {
    return moment(dateField).fromNow();
  }

  presentSeller(sellerId: string) {
    this.navCtrl.push(SellerPage, {id : sellerId});
  }

}
