import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';
import { User } from '../models/user';
import { ServiceService } from '../service/service.service';
import { Manga } from '../models/manga';
import { Favorite } from '../models/favorite';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
})
export class FavoriteComponent implements OnInit {
  favorites: Favorite[] = [];
  favoriteManga: any[] = [];
  second: Manga[] = [];
  manga!: Manga;
  utente!: User;
  currentPage: number = 0;
  nextPage = this.currentPage + 1;

  constructor(
    private authSrv: AuthService,
    private service: ServiceService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.getme();
    // this.getFavorites();
    this.getTop();
  }
  getme() {
    this.authSrv.getMe().subscribe((it) => {
      this.utente = it;
      console.log(this.utente);
      this.service.getFavorite(it.id).subscribe(
        (favorites: Favorite[]) => {
          this.favorites = favorites;
          console.log(this.favorites);
          favorites.forEach((favorite) => {
            this.favoriteManga.push(favorite.manga);
          });
          console.log('favoritemanga: ' + this.favoriteManga);
        },
        (error) => {
          console.error('Errore durante il recupero dei preferiti:', error);
        }
      );
    });
  }

  getManga(id: number): Observable<Manga> {
    return this.service.getMangaSingolo(id);
  }

  // getFavorites() {
  //   if (this.utente) {
  //     this.service
  //       .getFavorite(this.currentPage, this.utente.id)
  //       .subscribe((data) => {
  //         const favoriteCount = data.length;
  //         let processedCount = 0;
  //         for (let i = 0; i < favoriteCount; i++) {
  //           this.getManga(data[i].manga).subscribe((it) => {
  //             processedCount++;
  //             this.favorites.push(it);
  //             if (processedCount === favoriteCount) {
  //               console.log('Tutti i manga preferiti sono stati elaborati.');
  //             }
  //             console.log(this.favorites);
  //           });
  //         }
  //       });
  //   }
  // }

  next() {
    this.service.nextFavorite(this.currentPage).subscribe((data) => {
      this.currentPage = this.nextPage;
      // this.favorites = data;
      // this.existNext();
    });
  }

  previous() {
    const previousPage = this.currentPage - 1;
    this.service.previousFavorite(previousPage).subscribe((data) => {
      this.currentPage = previousPage;
      // this.favorites = data;
      // this.existPrevious();
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
      this.route.navigate(['/manga', id]);
      console.log(it);
    });
  }
}
