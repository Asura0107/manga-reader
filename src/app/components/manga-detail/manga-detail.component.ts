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
import { Favorite } from '../models/favorite';
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
  content: string = '';
  isFavorite!: boolean;

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
        this.checkFavorite();
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

  postComment(mangaId: number) {
    if (this.utente) {
      const newComment = {
        user: this.utente.id,
        content: this.content,
      };
      this.service.postComment(newComment, mangaId).subscribe(
        (comment) => {
          console.log(comment);
          this.getComments(this.manga.title);
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }

  // bookmark() {
  //   if (this.utente) {
  //     const data = {
  //       manga: this.manga.id,
  //       user: this.utente.id,
  //     };
  //     if (this.getSingleFavorite == null) {
  //       this.service
  //         .saveFavorite(data)
  //         .subscribe(() => (this.isFavorite = !this.isFavorite));
  //     }
  //   }
  // }

  unbookmark() {
    if (this.utente) {
      this.service
        .deleteFavorite(this.utente.id, this.manga.id)
        .subscribe(() => (this.isFavorite = !this.isFavorite));
    }
  }

  getChapterSingle(id: number) {
    this.service.getChapterSingolo(id).subscribe((it) => {
      this.route.navigate(['/chapter', id]);
      console.log(it);
    });
  }

  checkFavorite() {
    if (this.utente) {
      this.service
        .getSingleFavorite(this.utente.id, this.manga.id)
        .subscribe((isFavorite) => {
          this.isFavorite = isFavorite;
          console.log(isFavorite);
        });
    }
  }

  bookmark() {
    if (this.utente) {
      const data = {
        manga: this.manga.id,
        user: this.utente.id,
      };
      this.service.getSingleFavorite(this.utente.id, this.manga.id).subscribe(
        (isFavorite) => {
          if (!isFavorite) {
            this.service.saveFavorite(data).subscribe(
              () => {
                this.isFavorite = true;
                console.log('Manga aggiunto con successo!');
              },
              (error) => {
                console.error('Error:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }

  // getSingleFavorite() {
  //   if (this.utente) {
  //     this.service
  //       .getSingleFavoritecheck(this.utente.id, this.manga.id)
  //       .subscribe(
  //         (isFavorite) => {
  //           // this.isFavorite = isFavorite;
  //           console.log('Il manga è nei preferiti:', isFavorite);
  //         },
  //         (error) => {
  //           console.error('Error:', error);
  //         }
  //       );
  //   }
  // }
}
