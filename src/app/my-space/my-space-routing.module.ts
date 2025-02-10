import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MySpaceComponent } from './components/my-space/my-space.component';
import { MyRoomsComponent } from './components/my-space/my-rooms/my-rooms.component';
import { MyBadgesComponent } from './components/my-space/my-badges/my-badges.component';

const routes: Routes = [
 // Child routes define the content rendered in parent's router-outlet.
    // When navigating to '/my-space/my-rooms':
    // 1. Router renders MySpaceComponent in app's main router-outlet
    // 2. Then finds router-outlet inside MySpaceComponent
    // 3. Renders MyRoomsComponent in that child router-outlet
    // This creates a nested view hierarchy matching the URL structure
  { path: '', component: MySpaceComponent,  
    children: [
      {path : 'my-rooms', component : MyRoomsComponent}, 
      {path : 'my-badges', component : MyBadgesComponent},
      {path : '', redirectTo : 'my-rooms', pathMatch : 'full'},
      {path : '**', redirectTo : 'my-rooms'}
    ]
  }
];
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports : [
    RouterModule
  ]
})
export class MySpaceRoutingModule { }
