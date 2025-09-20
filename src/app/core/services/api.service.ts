import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  post<T>(path: string, body: object = {}) {
    return this.http.post<T>(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true // CRITICAL: This sends the session cookie with every request
      }
    );
  }

  get<T>(path: string) {
    return this.http.get<T>(`${environment.apiUrl}${path}`, { withCredentials: true });
  }
    delete<T>(path: string) {
    return this.http.delete<T>(`${environment.apiUrl}${path}`, { withCredentials: true });
  }
}
