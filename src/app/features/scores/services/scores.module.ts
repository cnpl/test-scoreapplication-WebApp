import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ScoresRoutingModule } from './scores-routing.module';
import { ScoreListComponent } from './components/score-list/score-list.component';

@NgModule({
  declarations: [
    ScoreListComponent
  ],
  imports: [
    CommonModule,
    ScoresRoutingModule,
    ReactiveFormsModule
  ]
})
export class ScoresModule { }
