import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RoomsRoutingModule } from './rooms-routing.module';
import { RoomsComponent } from './components/rooms/rooms.component';
import { RoomsBannerComponent } from './components/rooms/rooms-banner/rooms-banner.component';



@NgModule({
  declarations: [
    RoomsComponent,
    RoomsBannerComponent
  ],
  imports: [
    CommonModule,
    RoomsRoutingModule,
    SharedModule // this will provide us with the icons module and the reusable room card component
  ]
})
export class RoomsModule { }
