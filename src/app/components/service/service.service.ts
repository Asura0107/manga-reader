import { Injectable } from '@angular/core';
import { Manga } from '../models/manga';
import { Favorite } from '../models/favorite';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthData } from 'src/app/auth/auth-data';
import { Observable, map } from 'rxjs';
import { Page } from '../models/page';
@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  apiURL = environment.apiURL;
  manga!: Manga;
  currentPage = 0;

  constructor(private http: HttpClient) {}

  //metodi per fare la get dei manga
  getAllManga(page: number = 0): Observable<Manga[]> {
    const params = new HttpParams().set('page', page.toString());
    this.currentPage = page; // Memorizza la pagina corrente
    return this.http
      .get<Page<Manga>>(`${this.apiURL}/manga/all`, { params })
      .pipe(map((list) => list.content));
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
}
