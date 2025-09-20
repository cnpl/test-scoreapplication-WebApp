import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoreListComponent } from './components/score-list/score-list.component';

const routes: Routes = [
  { path: '', component: ScoreListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScoresRoutingModule { }
