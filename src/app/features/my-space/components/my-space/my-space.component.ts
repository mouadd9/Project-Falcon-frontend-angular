import { Component } from '@angular/core';

@Component({
  selector: 'app-my-space',
  standalone: false,
  templateUrl: './my-space.component.html',
  styleUrl: './my-space.component.scss'
})
export class MySpaceComponent {
  // smart component (container component)
  // this component will inject the store 
  // and will select observables from the store
  // then pass them to app-profile-banner and components that display rooms
  

}
