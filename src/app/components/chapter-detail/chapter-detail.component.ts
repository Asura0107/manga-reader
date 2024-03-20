import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chapter } from '../models/chapter';
import { Panel } from '../models/panel';
import { ServiceService } from '../service/service.service';
import { Manga } from '../models/manga';
@Component({
  selector: 'app-chapter-detail',
  templateUrl: './chapter-detail.component.html',
  styleUrls: ['./chapter-detail.component.scss'],
})
export class ChapterDetailComponent implements OnInit {
  chapter!: Chapter;
  panels: Panel[] = [];
  manga!: Manga;
  constructor(
    private routeActive: ActivatedRoute,
    private service: ServiceService
  ) {}

  ngOnInit(): void {
    this.routeActive.params.subscribe((param) => {
      const id = +param['id'];
      this.service.getChapterSingolo(id).subscribe((retrieved) => {
        this.chapter = retrieved;
        console.log(retrieved);
        this.getPanel(retrieved.id);
        this.getmangaByChapter(retrieved.id);
      });
    });
  }

  getPanel(id: number) {
    this.service.getPanels(id).subscribe((it) => {
      this.panels = it;
      console.log(it);
    });
  }

  getmangaByChapter(id: number) {
    this.service.getMangaByChapterId(id).subscribe((it) => {
      this.manga = it;
      console.log(it);
    });
  }
}
