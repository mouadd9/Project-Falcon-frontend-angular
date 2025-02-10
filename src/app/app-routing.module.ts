import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: 'auth', 
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  }, // every URL that starts with auth will load AuthModule, configure the router with child routes and then it will scan the child routes to know which component to render
  { 
    path: 'my-space',
    loadChildren: () => import('./my-space/my-space.module').then(m => m.MySpaceModule)
  },
  {
    path : 'rooms',
    loadChildren: () => import('./rooms/rooms.module').then(m=>m.RoomsModule)
  },
  { path: '', redirectTo: 'auth/sign-in', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/sign-in' } // wild card route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }