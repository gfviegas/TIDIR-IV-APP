import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AuthService} from '../../providers/auth/auth';

@Component({
  templateUrl: 'build/pages/contact/contact.html',
  providers: [AuthService]
})
export class ContactPage {
    isLoggedIn: boolean;
    loggedUser: any;

  constructor(
      private navCtrl: NavController,
      private authService: AuthService
  ) {
      this.isLoggedIn = authService.isLoggedIn();
      this.loggedUser = authService.getLoggedUser();
  }
}
