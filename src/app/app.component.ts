import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Keyboard, AppRate } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { SellersTabsPage } from '../pages/sellers-tabs/sellers-tabs';
import { LoginPage } from '../pages/login/login';

import { AuthService } from '../providers/auth/auth';
// import moment from 'moment';
import moment from 'moment';
import 'moment/src/locale/pt-br';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage: any;

  constructor(
    public platform: Platform,
    public authService: AuthService
  ) {
    moment.locale('pt-br');
    let userLogged = this.authService.isLoggedIn();

    if (! userLogged) {
      this.rootPage = LoginPage;
    } else {
      let type = this.authService.getLoggedUser().type;
      if (type === 'seller') {
        this.rootPage = SellersTabsPage;
      } else {
        this.rootPage = TabsPage;
      }
    }

    platform.ready().then(() => {
      StatusBar.backgroundColorByHexString('#806722');

      Keyboard.onKeyboardShow().subscribe(() => {
        document.body.classList.add('keyboard-is-open');
      });

      Keyboard.onKeyboardHide().subscribe(() => {
        document.body.classList.remove('keyboard-is-open');
      });

      AppRate.preferences.displayAppName = 'aVender';
      AppRate.preferences.useLanguage = 'pt';
      AppRate.preferences.storeAppURL = {
        android: 'market://details?id=com.gfviegas.avender',
      };

      AppRate.promptForRating(false);
    });
  }
}
