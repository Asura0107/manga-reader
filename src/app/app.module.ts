import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { MangaDetailComponent } from './components/manga-detail/manga-detail.component';
import { ChapterDetailComponent } from './components/chapter-detail/chapter-detail.component';
import { PayComponent } from './components/pay/pay.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { SignupComponent } from './auth/signup/signup.component';
import { TokenInterceptor } from './auth/token.interceptor';
import { ProfileComponent } from './components/profile/profile.component';
import { ComicsComponent } from './components/comics/comics.component';
const routes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'comics',
    component: ComicsComponent,
  },
  {
    path: 'register',
    component: SignupComponent,
  },
  {
    path: 'pay',
    component: PayComponent,
  },
  {
    path: 'favorite',
    component: FavoriteComponent,
  },
  {
    path: 'manga/:id',
    component: MangaDetailComponent,
  },
  {
    path: 'chapter/:id',
    component: ChapterDetailComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MangaDetailComponent,
    ChapterDetailComponent,
    PayComponent,
    NavbarComponent,
    HomeComponent,
    FavoriteComponent,
    SignupComponent,
    ProfileComponent,
    ComicsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
