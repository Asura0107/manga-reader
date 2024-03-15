import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Manga } from '../models/manga';
import { AuthService } from 'src/app/auth/service/auth.service';
import { AuthData } from 'src/app/auth/auth-data';
import { take } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  first!: Manga;
  second: Manga[] = [];
  utente!: AuthData | null;
  titles: string[] = [
    'Return of the Mount Hua Sect',
    'Solo Leveling',
    'The Descent Of The Demonic Master',
    'I’ll Be The Matriarch In This Life',
    'Nano Machine',
  ];
  popular: Manga[] = [];
  constructor(private service: ServiceService, private authSrv: AuthService) {}

  ngOnInit(): void {
    // this.getallManga();
    this.getMangaRandom();
    this.getTop();
    this.getPopular();
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
  getPopular() {
    this.titles.forEach((title) => {
      this.service
        .getByTitle(title)
        .pipe(take(1))
        .subscribe((manga) => {
          console.log(`Manga by title ${title}:`, manga);
          this.popular.push(...manga);
          console.log(this.popular);
        });
    });
  }
}
