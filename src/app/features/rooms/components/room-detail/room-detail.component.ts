import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { JoinRoomActions, LeaveRoomActions, RoomDetailActions, SaveRoomActions, UnsaveRoomActions } from '../../state/room-detail/room-detail.actions';
import { Observable } from 'rxjs';
import { RoomModel } from '../../../../core/models/room.model';
import {
  joiningButtonState,
  savingButtonState,
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
import { JwtService } from '../../../../core/services/jwt.service';

// The RoomDetailComponent's purpose is to display detailed information about a specific room
// with the ID coming from the URL parameter.
@Component({
  selector: 'app-room-detail',
  standalone: false,
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.scss',
})
export class RoomDetailComponent implements OnInit, OnDestroy {
  public room$!: Observable<RoomModel | null>;
  public isLoading$!: Observable<boolean>;
  public error$!: Observable<string | null>;
  // when this components loads we will get the userId and roomId and store them here.
  // then we will be using it each time wa do an action on the room
  userId!: number;
  private roomId!: number;

  // Modal state
  showLeaveConfirmModal: boolean = false;

  joinButtonState$!: Observable<string | undefined>;
  saveButtonState$!: Observable<string | undefined>;

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

  constructor(private route: ActivatedRoute, private store: Store, private jwtService: JwtService) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getUserIdAndRoomId();
    this.selectState(); // we select state
    this.getRoomDetails(); // we dispatch an action to get a room
  }

  private getUserIdAndRoomId(): void {
    this.userId = this.jwtService.getUserIdFromToken();
    this.roomId = +this.route.snapshot.params['id'];
  }

  private selectState(): void {
    this.room$ = this.store.select(selectCurrentRoom);
    this.isLoading$ = this.store.select(selectRoomDetailLoading);
    this.error$ = this.store.select(selectRoomDetailError);
    this.joinButtonState$ = this.store.select(joiningButtonState);
    this.saveButtonState$ = this.store.select(savingButtonState);
  }

  private getRoomDetails(): void {
    this.store.dispatch( RoomDetailActions.loadRoomDetail({ roomId: this.roomId }) ); // dispatch an action, to load room details
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

  public saveRoom() {
    this.store.dispatch(SaveRoomActions.saveRoom({ userId: this.userId, roomId: this.roomId }));
  }

  public unsaveRoom() {  
    this.store.dispatch(UnsaveRoomActions.unsaveRoom({ userId: this.userId, roomId: this.roomId }))
  }
  public joinRoom() {
    this.store.dispatch(JoinRoomActions.joinRoom({ userId: this.userId, roomId: this.roomId }));
  }

  public leaveRoom() {
    // Show the confirmation modal instead of immediately leaving
    this.showLeaveConfirmModal = true;
  }

  public confirmLeaveRoom() {
    // Close the modal
    this.showLeaveConfirmModal = false;
    // Dispatch the leave room action
    this.store.dispatch(LeaveRoomActions.leaveRoom({ userId: this.userId, roomId: this.roomId }));
  }

  public cancelLeaveRoom() {
    // Just close the modal without taking any action
    this.showLeaveConfirmModal = false;
  }

  public launchInstance() {
    throw new Error('Method not implemented.');
  }

  // Helper method to calculate completed challenges based on percentage
  public getCompletedChallenges(room: RoomModel): number {
    if (!room.totalChallenges) return 0;
    return Math.round((room.percentageCompleted / 100) * room.totalChallenges);
  }

  ngOnDestroy(): void {
    this.store.dispatch(RoomDetailActions.clearRoomDetail()); // Clear room detail state when leaving the component
  }
}
