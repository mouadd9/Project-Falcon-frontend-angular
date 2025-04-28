import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RoomsRoutingModule } from './rooms-routing.module';
import { RoomsComponent } from './components/rooms/rooms.component';
import { RoomsBannerComponent } from './components/rooms/rooms-banner/rooms-banner.component';
import { RoomDetailComponent } from './components/room-detail/room-detail.component';
import { StoreModule } from '@ngrx/store';
import { roomDetailReducer } from './state/room-detail/room-detail.reducer';
import { EffectsModule } from '@ngrx/effects';
import { RoomDetailEffects } from './state/room-detail/room-detail.effects';



@NgModule({
  declarations: [
    RoomsComponent,
    RoomsBannerComponent,
    RoomDetailComponent
  ],
  imports: [
    RoomsRoutingModule,
    SharedModule, // this will provide us with the icons module and the reusable room card component
    StoreModule.forFeature('roomDetail', roomDetailReducer), // when this module loads we provide the store with this feature and the initial state.
    EffectsModule.forFeature([RoomDetailEffects])
  ]
})
export class RoomsModule { }
