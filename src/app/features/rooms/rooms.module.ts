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
import { InstanceEffects } from './state/instance/instance.effects';
import { instanceReducer } from './state/instance/instance.reducer';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { VpnEffects } from './state/vpn/vpn.effects';
import { vpnReducer } from './state/vpn/vpn.reducer';



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
    EffectsModule.forFeature([RoomDetailEffects]),
    StoreModule.forFeature('rooms', roomsReducer),
    EffectsModule.forFeature([RoomsEffects]),
    StoreModule.forFeature('instance', instanceReducer),
    EffectsModule.forFeature([InstanceEffects]),
    StoreModule.forFeature('vpn', vpnReducer),
    EffectsModule.forFeature([VpnEffects]),
    ClipboardModule
  ]
})
export class RoomsModule { }
