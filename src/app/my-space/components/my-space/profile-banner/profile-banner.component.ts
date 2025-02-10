import { Component } from '@angular/core';
import { faMedal, faDoorOpen, faServer, faFire } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-banner',
  standalone: false,
  templateUrl: './profile-banner.component.html',
  styleUrl: './profile-banner.component.scss'
})
export class ProfileBannerComponent {
  // Font Awesome icons
  faMedal = faMedal;
  faDoorOpen = faDoorOpen;
  faServer = faServer;
  faFire = faFire;
}
