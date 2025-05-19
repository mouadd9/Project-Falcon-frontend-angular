import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Challenge } from '../../../../../core/models/challenge.model';
import {
  faBars,
  faChevronDown,
  faChevronUp,
  faLock,
  faMedal,
  faCheck,
  faTimes,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { JwtService } from '../../../../../core/services/jwt.service';
import { selectFlagSubmissionError, selectIsSubmittingFlag, selectLastSubmissionResult, selectSubmittingChallengeId } from '../../../state/room-detail/room-detail.selectors';
import { FlagSubmissionActions } from '../../../state/room-detail/room-detail.actions';

@Component({
  selector: 'app-challenges',
  standalone: false,
  templateUrl: './challenges.component.html',
  styleUrl: './challenges.component.scss',
})
export class ChallengesComponent implements OnChanges, OnInit {
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
  faCheck = faCheck;
  faTimes = faTimes;
  faExclamationTriangle = faExclamationTriangle;

  // Track expanded state for each challenge
  expandedChallenges: { [key: number]: boolean } = {};

  // Flag submission state
  isSubmitting$!: Observable<boolean>;
  submittingChallengeId$!: Observable<number | null>;
  lastSubmission$!: Observable<{ challengeId: number | null, correct: boolean | null }>;
  submissionError$!: Observable<string | null>;
  userId!: number;
  
  constructor(
    private store: Store,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.userId = this.jwtService.getUserIdFromToken();
    this.isSubmitting$ = this.store.select(selectIsSubmittingFlag);
    this.submittingChallengeId$ = this.store.select(selectSubmittingChallengeId);
    this.lastSubmission$ = this.store.select(selectLastSubmissionResult);
    this.submissionError$ = this.store.select(selectFlagSubmissionError);
  }

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

  // Submit a flag
  submitFlag(challengeId: number, flag: string): void {
    if (!this.isJoined || !flag.trim()) {
      return;
    }
    
    this.store.dispatch(FlagSubmissionActions.submitFlag({
      userId: this.userId,
      challengeId,
      flag: flag.trim()
    }));
  }
  
}