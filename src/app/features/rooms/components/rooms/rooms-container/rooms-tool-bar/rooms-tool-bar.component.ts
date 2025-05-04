import { Component } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-rooms-tool-bar',
  standalone: false,
  templateUrl: './rooms-tool-bar.component.html',
  styleUrl: './rooms-tool-bar.component.scss'
})
export class RoomsToolBarComponent {
  faSearch = faSearch;
}
