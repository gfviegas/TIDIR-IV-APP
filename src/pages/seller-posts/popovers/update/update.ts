import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';

import { PostsService, PostObject } from '../../../../providers/posts/posts';

@Component({
  templateUrl: 'update.html'
})
export class UpdatePostPage {
  post: PostObject;
  sellerId: any;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public postsService: PostsService
  ) {
    this.post = params.data.post;
    this.sellerId = params.data.sellerId;
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
        this.viewCtrl.dismiss(true);
      }
    );
  }
}
