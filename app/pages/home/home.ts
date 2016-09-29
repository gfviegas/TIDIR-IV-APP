import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import * as moment from 'moment';
import 'rxjs/add/operator/map';
import { IMG_URL } from '../../config.ts';

import { PostsService, PostObject } from '../../providers/posts/posts';
import { AuthService } from '../../providers/auth/auth';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [PostsService]
})
export class HomePage {
  posts: Array<PostObject> = [];
  loading: boolean = false;
  IMG_URL: string = IMG_URL;

  constructor(
    private navCtrl: NavController,
    private postsService: PostsService,
    private authService: AuthService
  ) {
  }

  ionViewDidEnter() {
    this.loadInit();
  }

  loadInit(): void {
    this.loading = true;

    this.postsService.getUserFollowedSellersPosts(this.authService.getLoggedUserId())
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


}
