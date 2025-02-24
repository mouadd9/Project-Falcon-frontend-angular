import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'auth',
     loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  }, // every URL that starts with auth will load AuthModule, configure the router with child routes and then it will scan the child routes to know which component to render
  { path: 'my-space',
     loadChildren: () => import('./features/my-space/my-space.module').then(m => m.MySpaceModule),
     canActivate: [AuthGuard]
  },
  { path: 'rooms',
     loadChildren: () => import('./features/rooms/rooms.module').then(m => m.RoomsModule),
     canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'auth/sign-in', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/sign-in' } // wild card route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }