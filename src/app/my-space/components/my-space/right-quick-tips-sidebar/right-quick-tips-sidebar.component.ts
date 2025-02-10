import { Component } from '@angular/core';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-right-quick-tips-sidebar',
  standalone: false,
  
  templateUrl: './right-quick-tips-sidebar.component.html',
  styleUrl: './right-quick-tips-sidebar.component.scss'
})
export class RightQuickTipsSidebarComponent {
  // Font Awesome icons
  faLightbulb = faLightbulb;
}
