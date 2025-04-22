import { Component, Input } from '@angular/core';
import {
  faLeaf,
  faClock,
  faCube,
  faFire,
} from '@fortawesome/free-solid-svg-icons';
import { RoomModel } from '../../../../../models/room.model';

@Component({
  selector: 'app-my-room-card',
  standalone: false,
  templateUrl: './my-room-card.component.html',
  styleUrl: './my-room-card.component.scss',
})
export class MyRoomCardComponent {
  @Input() room!: RoomModel;
  // Font Awesome icons
  faLeaf = faLeaf;
  faClock = faClock;
  faCube = faCube;
  faFire = faFire;

  getComplexityIcon() {
    switch(this.room.complexity) {
      case 'EASY': return this.faLeaf;
      case 'MEDIUM': return this.faCube;
      case 'HARD': return this.faFire;
      default: return this.faLeaf;
    }
  }
  
  // Method to get formatted complexity text
  getComplexityText() {
    switch (this.room.complexity) {
      case 'EASY':
        return 'Easy';
      case 'MEDIUM':
        return 'Medium';
      case 'HARD':
        return 'Hard';
      default:
        return 'Easy';
    }
  }

  calculateDashOffset(percentage: number): number {
    // Full circle has a dasharray of 125.6 (from your CSS)
    // Convert the percentage (0-100) to a fraction (0-1)
    const fullCircle = 125.6;
    const fraction = percentage / 100;
    return fullCircle - fullCircle * fraction;
}
}
