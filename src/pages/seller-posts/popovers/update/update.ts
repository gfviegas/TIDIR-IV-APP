import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { PostsService, PostObject } from '../../../../providers/posts/posts';

@Component({
  templateUrl: 'update.html'
})
export class UpdatePostPage {
  post: PostObject;
  sellerId: any;
  showEditForm: boolean = false;

  postForm: FormGroup;
  postContent: AbstractControl;
  postFormSubmitted: boolean = false;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public fb: FormBuilder,
    public postsService: PostsService
  ) {
    this.post = params.data.post;
    this.sellerId = params.data.sellerId;

    this.postForm = fb.group({
      content: [this.post.content, Validators.required]
    });
    this.postContent = this.postForm.controls['content'];
  }

  confirmDelete() {
    let confirm = this.alertCtrl.create({
      title: 'Excluir Post',
      message: `Você realmente deseja excluir este post?`,
      buttons: [
        {
          text: 'Não'
        },
        {
          text: 'Sim',
          handler: () => {
            this.deletePost();
          }
        }
      ]
    });
    confirm.present();
  }

  deletePost() {
    this.postsService.deletePost(this.post._id).subscribe(
      (response) => {
        this.viewCtrl.dismiss({deleted: true});
      }
    );
  }

  toggleEditForm() {
    this.showEditForm = !this.showEditForm;
  }

  editPost() {
    this.postFormSubmitted = true;
    let content = this.postContent.value;

    if (this.postForm.valid) {
      this.updatePost(content);
    }
  }

  updatePost(content: string) {
    this.postsService.updatePost(this.post._id, content).subscribe(
      (response) => {
        this.viewCtrl.dismiss({updated: true, content: content});
      }
    )
  }
}
