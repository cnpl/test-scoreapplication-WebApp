import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ScoreDto } from '../../../shared/models/score.model';
import { User } from '../../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private apiService: ApiService) { }

  getAllUsers(): Observable<User[]> {
    return this.apiService.get<User[]>('/users');
  }

  getScoresForUser(userId: string): Observable<ScoreDto[]> {
    return this.apiService.get<ScoreDto[]>(`/scores/user/${userId}`);
  }
}
