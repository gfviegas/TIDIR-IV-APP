import { Component } from '@angular/core';
import { Platform, ionicBootstrap } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AuthHttp, AuthConfig, AUTH_PROVIDERS } from 'angular2-jwt';

import { LoginPage } from './pages/login/login';
import { TabsPage } from './pages/tabs/tabs';

import { AuthService } from './providers/auth/auth';

import * as moment from 'moment';
import 'moment/locale/pt-br';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [AuthService, AUTH_PROVIDERS]
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
      Splashscreen.hide();
      StatusBar.backgroundColorByHexString("#b08f2f");
    });
  }
}

ionicBootstrap(MyApp, [], {
  backButtonText: 'Voltar',
  tabsPlacement: 'bottom'
});
