import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  faClock,
  faBookmark,
  faCheckCircle,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-my-rooms-tabs',
  standalone: false,
  templateUrl: './my-rooms-tabs.component.html',
  styleUrls: ['./my-rooms-tabs.component.scss'],
})
export class MyRoomsTabsComponent {
  // Receive active filter from parent
  @Input() activeFilter: 'joined' | 'saved' | 'completed' | null = 'joined';

  // Emit filter change events to parent
  @Output() filterChanged = new EventEmitter<
    'joined' | 'saved' | 'completed'
  >();

  // Font Awesome icons
  faClock = faClock;
  faBookmark = faBookmark;
  faCheckCircle = faCheckCircle;
  faSearch = faSearch;

  // Method to handle tab clicks
  setFilter(filter: 'joined' | 'saved' | 'completed'): void {
    this.filterChanged.emit(filter);
  }
}
