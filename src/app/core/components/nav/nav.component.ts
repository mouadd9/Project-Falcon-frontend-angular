import { Component } from '@angular/core';
import { faCube, faDoorOpen, faUser, faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav',
  standalone: false,
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  // Font Awesome icons
  faCube = faCube;
  faDoorOpen = faDoorOpen;
  faUser = faUser;
  faChevronDown = faChevronDown;
}
