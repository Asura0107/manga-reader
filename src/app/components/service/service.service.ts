import { Injectable } from '@angular/core';
import { Manga } from '../models/manga';
import { Favorite } from '../models/favorite';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthData } from 'src/app/auth/auth-data';
import { Observable, catchError, map, of } from 'rxjs';
import { Page } from '../models/page';
import { Chapter } from '../models/chapter';
import { Comment } from '../models/comment';
import { Panel } from '../models/panel';
@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  apiURL = environment.apiURL;
  manga!: Manga;
  currentPage = 0;
  pageFavorite = 0;
  currentChapter = null;

  constructor(private http: HttpClient) {}

  //metodi per fare la get dei manga
  getAllManga(page: number = 0): Observable<Manga[]> {
    const params = new HttpParams().set('page', page.toString());
    this.currentPage = page; // Memorizza la pagina corrente
    return this.http
      .get<Page<Manga>>(`${this.apiURL}/manga/all`, { params })
      .pipe(map((list) => list.content));
  }

  next(page: number): Observable<Manga[]> {
    const params = new HttpParams().set('page', page.toString());
    this.currentPage = page + 1; // Memorizza la pagina corrente
    return this.http
      .get<Page<Manga>>(`${this.apiURL}/manga/all`, { params })
      .pipe(map((list) => list.content));
  }

  previous(page: number): Observable<Manga[]> {
    const params = new HttpParams().set('page', page.toString());
    this.currentPage = page - 1; // Memorizza la pagina corrente
    return this.http
      .get<Page<Manga>>(`${this.apiURL}/manga/all`, { params })
      .pipe(map((list) => list.content));
  }

  existNextPage(): Observable<boolean> {
    return this.http.get<Page<Manga>>(`${this.apiURL}/manga/all`).pipe(
      map((list) => {
        return list.number > this.currentPage + 1;
      })
    );
  }

  existPreviousPage(): Observable<boolean> {
    return this.http.get<Page<Manga>>(`${this.apiURL}/manga/all`).pipe(
      map((list) => {
        return 0 < this.currentPage - 1;
      })
    );
  }

  getTopFive(): Observable<Manga[]> {
    const params = new HttpParams().set('orderBy', 'likes');
    return this.http
      .get<Page<Manga>>(`${this.apiURL}/manga/all`, { params })
      .pipe(
        map((page) => {
          //confronta i manga in base al numero di like
          const sortedManga = page.content.sort(
            (a, b) => b.likes.length - a.likes.length
          );
          return sortedManga.slice(0, 5);
        })
      );
  }

  getMangaId() {
    return this.manga.id;
  }

  getMangaSingolo(id: number) {
    return this.http.get<Manga>(`${this.apiURL}/manga/${id}`);
  }

  getMangaByGenre(genre: string): Observable<Manga[]> {
    const params = new HttpParams().set('genre', genre);
    return this.http
      .get<Page<Manga>>(`${this.apiURL}/manga/genre`, { params })
      .pipe(map((list) => list.content));
  }

  getMangaRandom() {
    return this.http.get<Page<Manga>>(`${this.apiURL}/manga/all`).pipe(
      map((mangaList) => {
        const randomIndex = Math.floor(
          Math.random() * mangaList.content.length
        );
        return mangaList.content[randomIndex];
      })
    );
  }

  getByTitle(title: string): Observable<Manga[]> {
    const params = new HttpParams().set('title', title);
    return this.http
      .get<Page<Manga>>(`${this.apiURL}/manga`, { params })
      .pipe(map((list) => list.content));
  }

  //chapter
  getChapters(title: string) {
    const params = new HttpParams().set('title', title);
    return this.http.get<Chapter[]>(`${this.apiURL}/manga/chapters`, {
      params,
    });
  }

  getChaptersManga(id: number): Observable<Chapter[]> {
    return this.http
      .get<Manga>(`${this.apiURL}/manga/${id}`)
      .pipe(map((data) => data.chapters));
  }

  getChapterSingolo(id: number) {
    return this.http.get<Chapter>(`${this.apiURL}/chapter/${id}`);
  }

  getMangaByChapterId(id: number) {
    return this.http.get<Manga>(`${this.apiURL}/manga/chapter/${id}`);
  }

  patchChapter(id: number, body: { unlocked: boolean }) {
    const params = new HttpParams().set('chapterId', id.toString());
    return this.http.patch(`${this.apiURL}/chapter/unlocked`, body, { params });
  }

  nextChapter() {}

  //panel
  getPanels(id: number) {
    const params = new HttpParams().set('chapterId', id);
    return this.http.get<Panel[]>(`${this.apiURL}/chapter/get/panels`, {
      params,
    });
  }

  //comments
  getComments(title: string): Observable<Comment[]> {
    const params = new HttpParams().set('title', title);
    return this.http.get<Comment[]>(`${this.apiURL}/comments`, { params });
  }

  postComment(data: Partial<Comment>, mangaId: number): Observable<Comment> {
    const params = new HttpParams().set('mangaId', mangaId.toString());
    return this.http.post<Comment>(`${this.apiURL}/comments`, data, { params });
  }

  //favorite
  getFavorite(userid: string): Observable<Favorite[]> {
    const params = new HttpParams().set('userId', userid);
    return this.http.get<Favorite[]>(`${this.apiURL}/favorites/myfavorite`, {
      params,
    });
  }

  nextFavorite(page: number): Observable<Favorite[]> {
    const params = new HttpParams().set('page', page.toString());
    this.pageFavorite = page + 1; // Memorizza la pagina corrente
    return this.http
      .get<Page<Favorite>>(`${this.apiURL}/favorites/my-favorite`, { params })
      .pipe(map((list) => list.content));
  }

  previousFavorite(page: number): Observable<Favorite[]> {
    const params = new HttpParams().set('page', page.toString());
    this.pageFavorite = page - 1; // Memorizza la pagina corrente
    return this.http
      .get<Page<Favorite>>(`${this.apiURL}/favorites/my-favorite`, { params })
      .pipe(map((list) => list.content));
  }

  saveFavorite(data: { manga: number; user: string }): Observable<Favorite> {
    return this.http.post<Favorite>(`${this.apiURL}/favorites`, data);
  }

  deleteFavorite(userId: string, mangaId: number): Observable<void> {
    const params = new HttpParams().set('userId', userId);
    return this.http.delete<void>(
      `${this.apiURL}/favorites/delete/${mangaId}`,
      {
        params,
      }
    );
  }

  getSingleFavoritecheck(
    userId: string,
    mangaId: number
  ): Observable<Favorite> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<Favorite>(
      `${this.apiURL}/favorites/manga/${mangaId}`,
      {
        params,
      }
    );
  }
  getSingleFavorite(userId: string, mangaId: number): Observable<boolean> {
    const params = new HttpParams().set('userId', userId);
    return this.http
      .get<Favorite>(`${this.apiURL}/favorites/manga/${mangaId}`, { params })
      .pipe(
        map((favorite) => {
          return !!favorite; // Restituisce true se esiste un preferito, altrimenti false(se da null, NaN, ...)
        }),
        catchError(() => {
          return of(false); // Se si verifica un errore(404), restituisci false
        })
      );
  }

  //user
  patchProfile(userId: string, body: { points: number }) {
    const params = new HttpParams().set('userId', userId);
    return this.http.patch(`${this.apiURL}/users/me`, body, { params });
  }
}
