import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverUrl } from '../../environments/environment';
import { Article } from '../models/article';
import { Observable } from 'rxjs';

const baseUrl = `${serverUrl}/api/articles`;

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Article[]> {
    return this.http.get<Article[]>(`${baseUrl}`);
  }

  delete(id: string): Observable<string> {
    return this.http.delete<string>(`${baseUrl}/${id}`);
  }
}
