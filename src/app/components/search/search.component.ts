import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Manga } from '../models/manga';
import { AuthService } from 'src/app/auth/service/auth.service';
import { AuthData } from 'src/app/auth/auth-data';
import { Observable, map, take } from 'rxjs';
import { Chapter } from '../models/chapter';
import { Router } from '@angular/router';
import { Page } from '../models/page';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  all: Manga[] = [];
  second: Manga[] = [];
  constructor(
    private service: ServiceService,
    private authSrv: AuthService,
    private routeActive: ActivatedRoute,

    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeActive.params.subscribe((param) => {
      const title = param['title'];
      this.service.getByTitle(title).subscribe((retrieved) => {
        this.all = retrieved;
        console.log(retrieved);
      });
    });
    this.getTop();
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
