import { Injectable } from '@angular/core';
import { Manga } from '../models/manga';
import { Favorite } from '../models/favorite';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthData } from 'src/app/auth/auth-data';
import { Observable, map } from 'rxjs';
import { Page } from '../models/page';
import { Chapter } from '../models/chapter';
import { Comment } from '../models/comment';
@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  apiURL = environment.apiURL;
  manga!: Manga;
  currentPage = 0;
  pageFavorite = 0;

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

  getMangaByGenre(genre: string) {
    return this.http.get<Manga[]>(`${this.apiURL}/manga/genre?genre=${genre}`);
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
  getFavorite(page: number = 0): Observable<Favorite[]> {
    const params = new HttpParams().set('page', page.toString());
    this.pageFavorite = page;
    return this.http
      .get<Page<Favorite>>(`${this.apiURL}/favorites/my-favorite`, { params })
      .pipe(map((list) => list.content));
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
}
