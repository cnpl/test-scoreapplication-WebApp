import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { ScoreDto } from '../../../../shared/models/score.model';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-score-list',
  templateUrl: './score-list.component.html',
  styleUrls: ['./score-list.component.css']
})
export class ScoreListComponent implements OnInit {
  scores$!: Observable<ScoreDto[]>;
  scoreForm: FormGroup;
  private refreshScores$ = new BehaviorSubject<void>(undefined);

  constructor(private scoreService: ScoreService, private fb: FormBuilder) {
    this.scoreForm = this.fb.group({
      value: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
    });
  }

  ngOnInit(): void {
    this.scores$ = this.refreshScores$.pipe(
      switchMap(() => this.scoreService.getMyScores())
    );
  }

  addScore(): void {
    if (this.scoreForm.invalid) return;

    const scoreValue = this.scoreForm.get('value')?.value;
    this.scoreService.addScore(scoreValue).subscribe(() => {
      this.scoreForm.reset();
      this.refreshScores$.next(); // Trigger a refresh
    });
  }

  deleteScore(id: number): void {
    if (confirm('Are you sure you want to delete this score?')) {
      this.scoreService.deleteScore(id).subscribe(() => {
        this.refreshScores$.next(); // Trigger a refresh
      });
    }
  }
}
