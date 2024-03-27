import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chapter } from '../models/chapter';
import { Panel } from '../models/panel';
import { ServiceService } from '../service/service.service';
import { Manga } from '../models/manga';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chapter-detail',
  templateUrl: './chapter-detail.component.html',
  styleUrls: ['./chapter-detail.component.scss'],
})
export class ChapterDetailComponent implements OnInit {
  chapter!: Chapter;
  chapters: Chapter[] = [];
  panels: Panel[] = [];
  manga!: Manga;

  constructor(
    private routeActive: ActivatedRoute,
    private service: ServiceService,
    private route: Router
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
      this.chapters = it.chapters;
      console.log('this', it);
    });
  }

  goToNextChapter(): void {
    const currentIndex = this.chapters.findIndex(
      (chapter) => chapter.id === this.chapter.id
    );
    if (currentIndex < this.chapters.length - 1) {
      const nextChapterId = this.chapters[currentIndex + 1].id;
      this.route.navigate(['/chapter', nextChapterId]);
    } else {
      console.log('No next chapter available');
    }
  }

  goToPreviousChapter(): void {
    const currentIndex = this.chapters.findIndex(
      (chapter) => chapter.id === this.chapter.id
    );
    if (currentIndex > 0) {
      const previousChapterId = this.chapters[currentIndex - 1].id;
      this.route.navigate(['/chapter', previousChapterId]);
    } else {
      console.log('No previous chapter available');
    }
  }

  getChapterSingle(event: any) {
    const selectedChapterId = event.target.value;
    this.service.getChapterSingolo(selectedChapterId).subscribe((it) => {
      if (it) {
        this.route.navigate(['/chapter', selectedChapterId]);
        console.log(it);
      }
    });
  }
}
