import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { RoomDetailActions } from '../../state/room-detail/room-detail.actions';
import { Observable } from 'rxjs';
import { RoomModel } from '../../../my-space/models/room.model';
import {
  selectCurrentRoom,
  selectRoomDetailError,
  selectRoomDetailLoading,
} from '../../state/room-detail/room-detail.selectors';
import {
  faClock,
  faCube,
  faFire,
  faLeaf,
  faPlayCircle,
  faServer,
  faBookmark as faBookmarkSolid,
  faUsers,
  faFlag,
  faSignOutAlt,
  faDoorOpen,
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';

// The RoomDetailComponent's purpose is to display detailed information about a specific room
// with the ID coming from the URL parameter.
@Component({
  selector: 'app-room-detail',
  standalone: false,
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.scss',
})
export class RoomDetailComponent implements OnInit, OnDestroy {
  room$!: Observable<RoomModel | null>;
  isLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  // font awesome
  // Font Awesome icons
  faClock = faClock;
  faLeaf = faLeaf;
  faCube = faCube;
  faFire = faFire;
  faServer = faServer;
  faDoorOpen = faDoorOpen;
  faUsers = faUsers;
  faFlag = faFlag;
  faBookmarkSolid = faBookmarkSolid;
  faBookmarkRegular = faBookmarkRegular;
  faPlayCircle = faPlayCircle;
  faSignOutAlt = faSignOutAlt;

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.selectState(); // we select state
    this.getRoomDetails(); // we dispatch an action to get a room
  }

  private selectState(): void {
    this.room$ = this.store.select(selectCurrentRoom);
    this.isLoading$ = this.store.select(selectRoomDetailLoading);
    this.error$ = this.store.select(selectRoomDetailError);
  }

  private getRoomDetails(): void {
    const roomId = +this.route.snapshot.params['id']; // retrieve the id of the selected room
    // Extract status from URL query parameters
    const isJoined = this.route.snapshot.queryParams['isJoined'] === 'true';
    const isSaved = this.route.snapshot.queryParams['isSaved'] === 'true';
    console.log('we reloaded the page !!');
    console.log(roomId);
    console.log('is joined:' + isJoined);
    console.log('is saved:' + isSaved);

    this.store.dispatch(
      RoomDetailActions.loadRoomDetail({ roomId, isJoined, isSaved })
    ); // dispatch an action, to load room details
  }

  public getComplexityIcon(complexity: string) {
    switch (complexity) {
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

  public getComplexityClass(complexity: string): string {
    switch (complexity) {
      case 'EASY':
        return 'easy';
      case 'MEDIUM':
        return 'medium';
      case 'HARD':
        return 'hard';
      default:
        return 'easy';
    }
  }

  unsaveRoom() {
    throw new Error('Method not implemented.');
  }
  saveRoom() {
    throw new Error('Method not implemented.');
  }
  launchInstance() {
    throw new Error('Method not implemented.');
  }
  joinRoom() {
    throw new Error('Method not implemented.');
  }
  leaveRoom() {
    throw new Error('Method not implemented.');
  }

  // Helper method to calculate completed challenges based on percentage
  public getCompletedChallenges(room: RoomModel): number {
    if (!room.totalChallenges) return 0;
    return Math.round((room.percentageCompleted / 100) * room.totalChallenges);
  }

  ngOnDestroy(): void {
    // Clear room detail state when leaving the component
    this.store.dispatch(RoomDetailActions.clearRoomDetail());
  }
}
