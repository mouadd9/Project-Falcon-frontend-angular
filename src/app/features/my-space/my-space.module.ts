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
import { MyRoomCardComponent } from './components/my-space/my-rooms/my-rooms-grid/my-room-card/my-room-card.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    MySpaceComponent,
    ProfileBannerComponent,
    MyRoomsComponent,
    MyBadgesComponent,
    ProfileBannerSubNavComponent,
    MyRoomsTabsComponent,
    MyRoomsGridComponent,
    RightQuickTipsSidebarComponent,
    MyRoomCardComponent
  ],
  imports: [
    CommonModule, 
    MySpaceRoutingModule,
    SharedModule
  ]
})
export class MySpaceModule { }
