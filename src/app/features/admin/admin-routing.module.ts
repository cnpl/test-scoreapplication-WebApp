import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserScoresComponent } from './components/user-scores/user-scores.component';

const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'user-scores/:id', component: UserScoresComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
