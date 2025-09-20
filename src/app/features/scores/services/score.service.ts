import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ScoreDto } from '../../../shared/models/score.model'; // We'll create this model next

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private basePath = '/scores';

  constructor(private apiService: ApiService) { }

  getMyScores(): Observable<ScoreDto[]> {
    return this.apiService.get<ScoreDto[]>(this.basePath);
  }

  addScore(scoreValue: number): Observable<ScoreDto> {
    return this.apiService.post<ScoreDto>(this.basePath, { value: scoreValue });
  }

  deleteScore(id: number): Observable<any> {
    // Note: We need to add a 'delete' method to our core ApiService
    return this.apiService.delete(`${this.basePath}/${id}`);
  }
}
