import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Manga } from '../models/manga';
import { AuthService } from 'src/app/auth/service/auth.service';
import { AuthData } from 'src/app/auth/auth-data';
import { Observable, map, take } from 'rxjs';
import { Chapter } from '../models/chapter';
import { Router } from '@angular/router';
import { Page } from '../models/page';
@Component({
  selector: 'app-comics',
  templateUrl: './comics.component.html',
  styleUrls: ['./comics.component.scss'],
})
export class ComicsComponent implements OnInit {
  all: Manga[] = [];
  second: Manga[] = [];
  currentPage: number = 0;
  currentPageGenre: number = 0;
  page!: Page<Manga>;
  nextPage = this.currentPage + 1;
  nextPageGenre = this.currentPageGenre + 1;
  showAllMode: boolean = true;
  genre!: string;

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
  next() {
    this.service.next(this.currentPage).subscribe((data) => {
      this.currentPage = this.nextPage;
      this.all = data;
      this.existNext();
    });
  }

  previous() {
    const previousPage = this.currentPage - 1;
    this.service.previous(previousPage).subscribe((data) => {
      this.currentPage = previousPage;
      this.all = data;
      this.existPrevious();
    });
  }
  nextGenre() {
    this.service
      .nextGenre(this.currentPageGenre, this.genre)
      .subscribe((data) => {
        this.currentPageGenre = this.nextPageGenre;
        this.all = data;
        this.existNext();
      });
  }

  previousGenre() {
    const previousPage = this.currentPageGenre - 1;
    this.service.previousGenre(previousPage, this.genre).subscribe((data) => {
      this.currentPageGenre = previousPage;
      this.all = data;
      this.existPrevious();
    });
  }
  existNext(): Observable<boolean> {
    return this.service.existNextPage().pipe(
      map((data) => {
        if (data) {
          console.log('Esiste una pagina successiva');
          return true;
        } else {
          console.log('Non esiste una pagina successiva');
          return false;
        }
      })
    );
  }
  existPrevious() {
    this.service.existNextPage().subscribe((data) => {
      if (data) {
        console.log('Esiste una pagina precedente');
      } else {
        console.log('Non esiste una pagina precedente');
      }
    });
  }
  existNextGenre(): Observable<boolean> {
    return this.service.existNextPageGenre().pipe(
      map((data) => {
        if (data) {
          console.log('Esiste una pagina successiva');
          return true;
        } else {
          console.log('Non esiste una pagina successiva');
          return false;
        }
      })
    );
  }
  existPreviousGenre() {
    this.service.existNextPageGenre().subscribe((data) => {
      if (data) {
        console.log('Esiste una pagina precedente');
      } else {
        console.log('Non esiste una pagina precedente');
      }
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

  getByGenre(event: any) {
    this.genre = event.target.value;
    this.service.getMangaByGenre(this.genre).subscribe((it) => {
      this.all = it;
      console.log(it);
    });
    this.showAllMode = false;
  }

  switchToAll() {
    this.showAllMode = true;
  }

  switchToGenre() {
    this.showAllMode = false;
  }
}
