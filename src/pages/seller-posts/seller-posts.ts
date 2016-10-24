import { Component } from '@angular/core';
import { NavController, ToastController, PopoverController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { IMG_URL } from '../../app/config';
import moment from 'moment';

import { UpdatePostPage } from './popovers/update/update';
import { PostsService, PostObject } from '../../providers/posts/posts';
import { AuthService } from '../../providers/auth/auth';

@Component({
  selector: 'page-seller-posts',
  templateUrl: 'seller-posts.html'
})
export class SellerPostsPage {

  sellerId: any;
  IMG_URL: string = IMG_URL;

  postForm: FormGroup;
  postContent: AbstractControl;
  postFormSubmitted: boolean = false;

  posts: Array<PostObject> = [];

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    public fb: FormBuilder,
    public postsService: PostsService,
    public authService: AuthService
  ) {
    this.postForm = fb.group({
      content: ['', Validators.required]
    });
    this.postContent = this.postForm.controls['content'];
    this.sellerId = authService.getLoggedUserId();
  }

  ionViewDidEnter() {
    this.loadInit();
  }

  loadInit() {
    this.postsService.getPosts(this.sellerId).subscribe(
      (response) => {
        this.posts = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  createPost() {
    this.postFormSubmitted = true;
    let content = this.postContent.value;
    this.postsService.createPost(this.sellerId, content).subscribe(
      (response) => {
        let toast = this.toastCtrl.create({
          message: 'Post criado com sucesso!',
          position: 'top',
          showCloseButton: true,
          closeButtonText: 'Fechar',
          duration: 3500
        });
        toast.present();
        this.posts.unshift(response);
      },
      (error) => {
        console.error(error);
      },
      () => {
        this.postForm.reset();
        this.postFormSubmitted = false;
      }
    );
  }

  presentUpdatePopover(event, post) {
    let popover = this.popoverCtrl.create(UpdatePostPage, {
      post: post,
      sellerId: this.sellerId
    });
    popover.onDidDismiss(
      (response) => {
        if (response.deleted) {
          let toast = this.toastCtrl.create({
            message: 'Post excluído com sucesso!',
            position: 'top',
            showCloseButton: true,
            closeButtonText: 'Fechar',
            duration: 3500
          });
          toast.present();
          let deletedPost = this.posts.find(p => p == post);
          let index = this.posts.indexOf(deletedPost, 0);
          if (index > -1) {
            this.posts.splice(index, 1);
          }
        } else if (response.updated) {
          let toast = this.toastCtrl.create({
            message: 'Post editado com sucesso!',
            position: 'top',
            showCloseButton: true,
            closeButtonText: 'Fechar',
            duration: 3500
          });
          toast.present();
          let updatedPost = this.posts.find(p => p == post);
          updatedPost.content = response.content;
        }
      }
    )
    popover.present();
  }

  fromNow(dateField) {
    return moment(dateField).fromNow();
  }

}
