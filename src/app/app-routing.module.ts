import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'scores',
    // We will create this module next
    // canActivate: [AuthGuard], // We will add a guard later
    loadChildren: () => import('./features/scores/scores.module').then(m => m.ScoresModule)
  },
  { path: '', redirectTo: '/scores', pathMatch: 'full' },
  { path: '**', redirectTo: '/scores' } // Redirect unknown paths
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
