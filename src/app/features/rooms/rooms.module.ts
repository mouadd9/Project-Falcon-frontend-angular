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
import { RoomsContainerComponent } from './components/rooms/rooms-container/rooms-container.component';
import { RoomsToolBarComponent } from './components/rooms/rooms-container/rooms-tool-bar/rooms-tool-bar.component';
import { RoomsListComponent } from './components/rooms/rooms-container/rooms-list/rooms-list.component';
import { RoomComponent } from './components/rooms/rooms-container/rooms-list/room/room.component';
import { roomsReducer } from './state/rooms/rooms.reducer';
import { RoomsEffects } from './state/rooms/rooms.effects';
import { ChallengesComponent } from './components/room-detail/challenges/challenges.component';



@NgModule({
  declarations: [
    RoomsComponent,
    RoomsBannerComponent,
    RoomsContainerComponent,
    RoomsToolBarComponent,
    RoomsListComponent,
    RoomComponent,
    RoomDetailComponent,
    ChallengesComponent
  ],
  imports: [
    RoomsRoutingModule,
    SharedModule, // this will provide us with the icons module and the reusable room card component
    StoreModule.forFeature('room-detail', roomDetailReducer), // when this module loads we provide the store with this feature and the initial state.
    StoreModule.forFeature('rooms', roomsReducer),
    EffectsModule.forFeature([RoomDetailEffects]),
    EffectsModule.forFeature([RoomsEffects])
  ]
})
export class RoomsModule { }
