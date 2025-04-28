import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomsComponent } from './components/rooms/rooms.component';
import { RoomDetailComponent } from './components/room-detail/room-detail.component';

const routes : Routes = [
  {path: '', component: RoomsComponent},
  {path: ':id', component: RoomDetailComponent} // this component will load when we select a room card 
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports : [
    RouterModule
  ]
})
export class RoomsRoutingModule { }
