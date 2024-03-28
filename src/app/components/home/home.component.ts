import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Manga } from '../models/manga';
import { AuthService } from 'src/app/auth/service/auth.service';
import { AuthData } from 'src/app/auth/auth-data';
import { take } from 'rxjs';
import { Chapter } from '../models/chapter';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  first!: Manga;
  second: Manga[] = [];
  reccomended: Manga[] = [];
  utente!: AuthData | null;
  chapter: Chapter[][] = [];
  chaptersByManga: { [title: string]: Chapter[] } = {};
  titles: string[] = [
    'Return of the Mount Hua Sect',
    'Solo Leveling',
    'The Descent Of The Demonic Master',
    'Nano Machine',
  ];
  popular: Manga[] = [];
  constructor(
    private service: ServiceService,
    private authSrv: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getallManga();
    this.getMangaRandom();
    this.getTop();
    this.getPopular();
    this.authSrv.restore();
    this.authSrv.user$.subscribe((_user) => {
      this.utente = _user;
    });
  }
  getallManga() {
    this.service.getAllManga().subscribe((data) => {
      this.reccomended = data;
      this.reccomended.forEach((manga) => {
        this.service.getChapters(manga.title).subscribe((chapters) => {
          const first3 = chapters.slice(0, 3);
          this.chaptersByManga[manga.title] = first3;
        });
      });
      console.log(this.reccomended);
    });
  }
  getMangaRandom() {
    this.service.getMangaRandom().subscribe((manga) => {
      // console.log(manga);
      this.first = manga;
    });
  }
  getTop() {
    this.service.getTopFive().subscribe((manga) => {
      // console.log(manga);
      this.second = manga;
    });
  }
  getPopular() {
    this.titles.forEach((title) => {
      this.service.getTitle(title).subscribe((manga) => {
        console.log(`Manga by title ${title}:`, manga);
        this.popular.push(manga);
        console.log(this.popular);
      });
    });
  }

  getSingleManga(id: number) {
    this.service.getMangaSingolo(id).subscribe((it) => {
      this.router.navigate(['/manga', id]);
      console.log(it);
    });
  }

  getChapterSingle(id: number) {
    this.service.getChapterSingolo(id).subscribe((it) => {
      this.router.navigate(['/chapter', id]);
      console.log(it);
    });
  }
}
