import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RoomModel } from '../../../../../../my-space/models/room.model';
import {
  faLeaf,
  faClock,
  faCube,
  faFire,
  faCheck, // Add this line
  faBookmark, // Add this line
  faTrophy, // Add this line
  faPlus, // Add this line
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-room',
  standalone: false,
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent {
  @Input() room!: RoomModel;
  // Font Awesome icons
  faLeaf = faLeaf;
  faClock = faClock;
  faCube = faCube;
  faFire = faFire;
  // New icons for badges
  faCheck = faCheck;
  faBookmark = faBookmark;
  faTrophy = faTrophy;
  faPlus = faPlus;
  constructor(private router: Router) {}

  public getComplexityIcon() {
    switch (this.room.complexity) {
      case 'EASY':
        return this.faLeaf;
      case 'MEDIUM':
        return this.faCube;
      case 'HARD':
        return this.faFire;
      default:
        return this.faLeaf;
    }
  }

  // Method to get formatted complexity text
  public getComplexityText() {
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

  public calculateDashOffset(percentage: number): number {
    // Full circle has a dasharray of 125.6 (from your CSS)
    // Convert the percentage (0-100) to a fraction (0-1)
    const fullCircle = 125.6;
    const fraction = percentage / 100;
    return fullCircle - fullCircle * fraction;
  }

  public navigateToRoomDetail() {
    this.router.navigate(['/rooms', this.room.id], {
      queryParams: {
        isJoined: this.room.isJoined,
        isSaved: this.room.isSaved,
      },
    });
  }
}
