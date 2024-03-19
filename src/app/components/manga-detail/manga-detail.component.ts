import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Manga } from '../models/manga';
import { ServiceService } from '../service/service.service';
import { Chapter } from '../models/chapter';
import { Title } from '@angular/platform-browser';
import { User } from '../models/user';
import { AuthData } from 'src/app/auth/auth-data';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Comment } from '../models/comment';
@Component({
  selector: 'app-manga-detail',
  templateUrl: './manga-detail.component.html',
  styleUrls: ['./manga-detail.component.scss'],
})
export class MangaDetailComponent implements OnInit {
  manga!: Manga;
  comments: Comment[] = [];
  second: Manga[] = [];
  chapters: Chapter[] = [];
  utente!: User;

  constructor(
    private service: ServiceService,
    private authSrv: AuthService,
    private routeActive: ActivatedRoute,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.routeActive.params.subscribe((param) => {
      const id = +param['id'];
      this.service.getMangaSingolo(id).subscribe((retrieved) => {
        this.manga = retrieved;
        console.log(retrieved);
        this.getChapters(id);
        this.getComments(this.manga.title);
      });
    });
    this.getTop();
    this.getme();
  }
  getme() {
    this.authSrv.getMe().subscribe((it) => {
      this.utente = it;
      console.log(this.utente);
    });
  }

  getTop() {
    this.service.getTopFive().subscribe((manga) => {
      // console.log(manga);
      this.second = manga;
    });
  }

  getChapters(id: number) {
    this.service.getChaptersManga(id).subscribe((data) => {
      this.chapters = data;
      console.log(this.chapters);
    });
  }

  getComments(title: string) {
    this.service.getComments(title).subscribe((data) => {
      this.comments = data;
      console.log(this.comments);
    });
  }
}
