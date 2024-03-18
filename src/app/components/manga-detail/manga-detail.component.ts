import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Manga } from '../models/manga';
import { ServiceService } from '../service/service.service';
import { Chapter } from '../models/chapter';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-manga-detail',
  templateUrl: './manga-detail.component.html',
  styleUrls: ['./manga-detail.component.scss'],
})
export class MangaDetailComponent implements OnInit {
  manga!: Manga;
  second: Manga[] = [];
  chapters: Chapter[] = [];

  constructor(
    private service: ServiceService,
    private routeActive: ActivatedRoute,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.routeActive.params.subscribe((param) => {
      const id = +param['id'];
      this.service.getMangaSingolo(id).subscribe((retrieved) => {
        this.manga = retrieved;
        console.log(retrieved);
      });
      this.getChapters(id);
    });
    this.getTop();
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
}
