import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Challenge } from '../../../../../core/models/challenge.model';
import {
  faBars,
  faChevronDown,
  faChevronUp,
  faLock,
  faMedal,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-challenges',
  standalone: false,
  templateUrl: './challenges.component.html',
  styleUrl: './challenges.component.scss',
})
export class ChallengesComponent implements OnChanges {
  // Our component receives @Input() values
  // We want to react to changes in the input values
  @Input() challenges: Challenge[] = []; // Initialize with an empty array to avoid undefined errors
  @Input() isJoined: boolean = false;

  // Font Awesome icons
  faBars = faBars;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faLock = faLock;
  faMedal = faMedal;

  // Track expanded state for each challenge
  expandedChallenges: { [key: number]: boolean } = {};

  constructor() {}

  // This method is tracking the expanded/collapsed state of each challenge in the UI
  ngOnChanges(changes: SimpleChanges): void {
    // Initialize expanded state for each challenge
    if (changes['challenges'] && this.challenges) {
      this.challenges.forEach((challenge) => {
        if (!(challenge.id in this.expandedChallenges)) {
          this.expandedChallenges[challenge.id] = false;
        }
      });
    }
    /*
     {
       1: false,  // Challenge with ID 1 is collapsed
       2: true,   // Challenge with ID 2 is expanded
       3: false   // Challenge with ID 3 is collapsed
     }
    */
  }

  // Toggle expanded state for a challenge
  toggleChallenge(challengeId: number): void {
    this.expandedChallenges[challengeId] = !this.expandedChallenges[challengeId];
  }

  // Check if a challenge is expanded
  isExpanded(challengeId: number): boolean {
    return this.expandedChallenges[challengeId] || false;
  }

    // For future implementation: submit a flag
  submitFlag(challengeId: number, flag: string): void {
    if (!this.isJoined) {
      console.log('User must join the room to submit flags');
      return;
    }
    
    console.log(`Submitting flag ${flag} for challenge ${challengeId}`);
    // This will be implemented later with service calls
  }
  
}