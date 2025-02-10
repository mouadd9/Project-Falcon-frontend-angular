import { Component } from '@angular/core';
import { faClock, faBookmark, faCheckCircle, faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-my-rooms-tabs',
  standalone: false,
  templateUrl: './my-rooms-tabs.component.html',
  styleUrls: ['./my-rooms-tabs.component.scss']
})
export class MyRoomsTabsComponent {
  // Font Awesome icons
  faClock = faClock;
  faBookmark = faBookmark;
  faCheckCircle = faCheckCircle;
  faSearch = faSearch;
}
