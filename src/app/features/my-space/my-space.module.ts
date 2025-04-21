import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MySpaceRoutingModule } from './my-space-routing.module';
import { MySpaceComponent } from './components/my-space/my-space.component';
import { ProfileBannerComponent } from './components/my-space/profile-banner/profile-banner.component';
import { MyRoomsComponent } from './components/my-space/my-rooms/my-rooms.component';
import { MyBadgesComponent } from './components/my-space/my-badges/my-badges.component';
import { ProfileBannerSubNavComponent } from './components/my-space/profile-banner-sub-nav/profile-banner-sub-nav.component';
import { MyRoomsTabsComponent } from './components/my-space/my-rooms/my-rooms-tabs/my-rooms-tabs.component';
import { MyRoomsGridComponent } from './components/my-space/my-rooms/my-rooms-grid/my-rooms-grid.component';
import { RightQuickTipsSidebarComponent } from './components/my-space/right-quick-tips-sidebar/right-quick-tips-sidebar.component';
import { SharedModule } from '../../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { myRoomsReducer } from './state/my-rooms.reducers';
import { EffectsModule } from '@ngrx/effects';
import { MyRoomsEffects } from './state/my-rooms.effects';
import { MyRoomCardComponent } from './components/my-space/my-rooms/my-rooms-grid/my-room-card/my-room-card.component';



@NgModule({
  declarations: [
    MySpaceComponent, // Claude we will focus on this
    ProfileBannerComponent, // Claude we will focus on this
    ProfileBannerSubNavComponent, // Claude we will focus on this
    MyRoomsComponent, // Claude we will focus on this
    MyBadgesComponent,
    MyRoomsTabsComponent, // Claude we will focus on this
    MyRoomsGridComponent, // Claude we will focus on this
    MyRoomCardComponent,
    RightQuickTipsSidebarComponent // Claude we will focus on this
  ],
  imports: [
    CommonModule, 
    SharedModule, // this will provide us with the icons module and the reusable room card component
    MySpaceRoutingModule, // Claude we will focus on this
    // now when this Module loads, the feature state will be registered to the store, and feature effects will also be registered to the store.
    StoreModule.forFeature('my-rooms', myRoomsReducer ), // Feature state
    EffectsModule.forFeature([MyRoomsEffects]), // Feature Effects
  ]
})
export class MySpaceModule { }
