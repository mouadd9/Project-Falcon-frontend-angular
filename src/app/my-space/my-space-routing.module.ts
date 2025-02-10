import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MySpaceComponent } from './components/my-space/my-space.component';

const routes: Routes = [
  { path: '', component: MySpaceComponent }, // Default my-space route
  { path: 'my-rooms', component: MySpaceComponent } // here it will be different but idk how 
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
