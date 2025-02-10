import { Component } from '@angular/core';
import { faLeaf, faClock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-my-room-card',
  standalone: false,
  
  templateUrl: './my-room-card.component.html',
  styleUrl: './my-room-card.component.scss'
})
export class MyRoomCardComponent {
  // Font Awesome icons
  faLeaf = faLeaf;
  faClock = faClock;
}
