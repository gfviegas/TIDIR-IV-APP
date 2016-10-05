import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';

/**
 * PAGES
 */
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProductPage } from '../pages/product/product';
import { ProductsPage } from '../pages/products/products';
import { ProductsCategoriesModalPage } from '../pages/products/modals/categories/categories';
import { ProductsFilterModalPage } from '../pages/products/modals/filter/filter';
import { ProductsSortModalPage } from '../pages/products/modals/sort/sort';
import { ProfilePage } from '../pages/profile/profile';
import { FollowingPage } from '../pages/profile/modals/following/following';
import { TermsPage } from '../pages/profile/modals/terms/terms';
import { EditUserPage } from '../pages/profile/modals/edit/edit';
import { SellerPage } from '../pages/seller/seller';
import { SellersPage } from '../pages/sellers/sellers';
import { SellersCategoriesModalPage } from '../pages/sellers/modals/categories/categories';
import { SellersFilterModalPage } from '../pages/sellers/modals/filter/filter';
import { SellersSortModalPage } from '../pages/sellers/modals/sort/sort';
import { SignInPage } from '../pages/sign-in/sign-in';
import { TabsPage } from '../pages/tabs/tabs';
import { SellersTabsPage } from '../pages/sellers-tabs/sellers-tabs';

/**
 * PROVIDERS
 */
import { AuthService } from '../providers/auth/auth';
import { CategoriesService } from '../providers/categories/categories';
import { PostsService } from '../providers/posts/posts';
import { ProductsService } from '../providers/products/products';
import { SellersService } from '../providers/sellers/sellers';
import { SignService } from '../providers/sign/sign';
import { UsersService } from '../providers/users/users';

/**
 * PLUGINS
 */
import { AuthHttp, AUTH_PROVIDERS } from 'angular2-jwt';
import { Storage } from '@ionic/storage';
// import { ImageViewerDirective } from 'ionic-img-viewer';
import MaskedInput from 'angular2-text-mask'

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    ProductPage,
    ProductsPage,
    ProductsCategoriesModalPage,
    ProductsFilterModalPage,
    ProductsSortModalPage,
    ProfilePage,
    FollowingPage,
    TermsPage,
    EditUserPage,
    SellerPage,
    SellersPage,
    SellersCategoriesModalPage,
    SellersFilterModalPage,
    SellersSortModalPage,
    SignInPage,
    TabsPage,
    SellersTabsPage,
    MaskedInput
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      backButtonText: 'Voltar',
      tabsPlacement: 'bottom'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    ProductPage,
    ProductsPage,
    ProductsCategoriesModalPage,
    ProductsFilterModalPage,
    ProductsSortModalPage,
    ProfilePage,
    FollowingPage,
    TermsPage,
    EditUserPage,
    SellerPage,
    SellersPage,
    SellersCategoriesModalPage,
    SellersFilterModalPage,
    SellersSortModalPage,
    SignInPage,
    TabsPage,
    SellersTabsPage
  ],
  providers: [
    AuthService,
    CategoriesService,
    PostsService,
    ProductsService,
    SellersService,
    SignService,
    UsersService,
    AuthHttp,
    AUTH_PROVIDERS,
    Storage
  ]
})
export class AppModule {
}
