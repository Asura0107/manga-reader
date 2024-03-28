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
import { Like } from '../models/like';
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
  selectedChapterId!: number;
  ids: string[] = [];
  unlockedes: Chapter[] = [];
  isLike!: boolean;
  arrayLikes: Like[] = [];
  users: String[] = [];
  likes!: Like | null;

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
        console.log(retrieved.likes);
        this.getChapters(id);
        this.getComments(this.manga.title);
        this.checkFavorite();
        this.getUnlocked();
        for (let i = 0; i < retrieved.likes.length; i++) {
          this.arrayLikes.push(retrieved.likes[i]);
        }
        console.log('this', this.arrayLikes);
      });
    });
    this.getTop();
    this.getme();
  }

  getSingleManga(id: number) {
    this.service.getMangaSingolo(id).subscribe((it) => {
      this.route.navigate(['/manga', id]);
      console.log(it);
    });
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
        avatar: this.utente.avatar,
        username: this.utente.username,
      };
      this.service.postComment(newComment, mangaId).subscribe(
        (comment) => {
          console.log(comment);
          this.getComments(this.manga.title);
          this.content = '';
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }

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

  onPatchProfile(id: number, point: number) {
    if (this.utente.points >= point) {
      this.service
        .patchProfile(this.utente.id, {
          points: this.utente.points - point,
        })
        .subscribe(() => {
          this.getme();
          // this.patchChapter(id);
          this.unlocked(id);
          this.getChapterSingle(id);
          this.getChapters(this.manga.id);
          console.log(this.utente.points - point);
        });
    }
  }

  patchChapter(id: number) {
    this.service
      .patchChapter(id, { unlocked: true })
      .subscribe(() => console.log(id));
  }

  unlocked(id: number) {
    if (this.utente) {
      this.service.unlockChapter(id, this.utente.id).subscribe((it) => {
        // console.log(it.unlockedByUsers);
        this.unlockedes.push(it);
      });
    }
  }

  getUnlocked() {
    if (this.utente) {
      this.service.getChapterUser(this.utente.id).subscribe((it) => {
        this.unlockedes = it;
        console.log(this.unlockedes);
      });
    }
  }

  isUnlocked(id: number): boolean {
    if (this.unlockedes) {
      return this.unlockedes.some((chapter) => chapter.id === id);
    }
    return false;
  }

  like() {
    if (this.utente) {
      const like = {
        user: this.utente.id,
      };
      this.service.like(this.manga.id, like).subscribe(
        (it) => {
          this.likes = it;
          this.isLike = true;
          console.log('Like inviato', it);
        },
        (error) => {
          console.error('Errore ', error);
        }
      );
    }
  }

  dislike() {
    if (this.utente && this.likes) {
      this.service
        .deleteLike(this.utente.id, this.manga.title, this.likes.id)
        .subscribe(() => {
          this.likes = null;
          this.isLike = false;
        });
    }
  }
}
