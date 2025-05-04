import { Component } from '@angular/core';
import { faCube, faDoorOpen, faFire, faLeaf } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-rooms-banner',
  standalone: false,
  templateUrl: './rooms-banner.component.html',
  styleUrl: './rooms-banner.component.scss'
})
export class RoomsBannerComponent {
  faDoorOpen = faDoorOpen;
  faLeaf = faLeaf;
  faCube = faCube;
  faFire = faFire;  

}
