import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Manga } from '../models/manga';
import { AuthService } from 'src/app/auth/service/auth.service';
import { AuthData } from 'src/app/auth/auth-data';
import { take } from 'rxjs';
import { Chapter } from '../models/chapter';
import { Router } from '@angular/router';
@Component({
  selector: 'app-comics',
  templateUrl: './comics.component.html',
  styleUrls: ['./comics.component.scss'],
})
export class ComicsComponent implements OnInit {
  all: Manga[] = [];
  second: Manga[] = [];

  constructor(
    private service: ServiceService,
    private authSrv: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getallManga();
    this.getTop();
  }
  getallManga() {
    this.service.getAllManga().subscribe((data) => {
      this.all = data;
    });
  }
  getTop() {
    this.service.getTopFive().subscribe((manga) => {
      // console.log(manga);
      this.second = manga;
    });
  }
  getSingleManga(id: number) {
    this.service.getMangaSingolo(id).subscribe((it) => {
      this.router.navigate(['/manga', id]);
      console.log(it);
    });
  }
}
