import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

import {LoginPage} from './pages/login/login';
import {TabsPage} from './pages/tabs/tabs';

import {AuthService} from './services/auth.service';

import * as moment from 'moment';
import 'moment/locale/pt-br';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [AuthService]
})
export class MyApp {

  private rootPage: any;

  constructor(
      private platform: Platform,
      private authService: AuthService
  ) {

    let userLogged = this.authService.isLoggedIn();

    if (! userLogged) {
        this.rootPage = LoginPage;
    } else {
        this.rootPage = TabsPage;
    }

    moment.locale('pt-BR');

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp);