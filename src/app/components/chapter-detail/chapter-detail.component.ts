import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chapter } from '../models/chapter';
import { Panel } from '../models/panel';
import { ServiceService } from '../service/service.service';
@Component({
  selector: 'app-chapter-detail',
  templateUrl: './chapter-detail.component.html',
  styleUrls: ['./chapter-detail.component.scss'],
})
export class ChapterDetailComponent implements OnInit {
  chapter!: Chapter;
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
      });
    });
  }
}
