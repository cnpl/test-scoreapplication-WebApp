import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { ScoreDto } from '../../../../shared/models/score.model';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-user-scores',
  templateUrl: './user-scores.component.html',
  styleUrls: ['./user-scores.component.css']
})
export class UserScoresComponent implements OnInit {
  scores$!: Observable<ScoreDto[]>;
  userId!: string;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.scores$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.userId = params.get('id')!;
        return this.adminService.getScoresForUser(this.userId);
      })
    );
  }
}
