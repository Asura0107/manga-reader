import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Manga } from '../models/manga';
import { AuthService } from 'src/app/auth/service/auth.service';
import { AuthData } from 'src/app/auth/auth-data';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  first!: Manga;
  second: Manga[] = [];
  utente!: AuthData | null;
  constructor(private service: ServiceService, private authSrv: AuthService) {}

  ngOnInit(): void {
    // this.getallManga();
    this.getMangaRandom();
    this.getTop();
    this.authSrv.restore();
    this.authSrv.user$.subscribe((_user) => {
      this.utente = _user;
    });
  }
  // getallManga() {
  //   this.service.getAllManga().subscribe((data) => {
  //     console.log(data);
  //     this.first = data;
  //   });
  // }
  getMangaRandom() {
    this.service.getMangaRandom().subscribe((manga) => {
      console.log(manga);
      this.first = manga;
    });
  }
  getTop() {
    this.service.getTopFive().subscribe((manga) => {
      console.log(manga);
      this.second = manga;
    });
  }
}
