import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, take, Subscription } from 'rxjs';
import { RoomModel } from '../../../../core/models/room.model';
import {
  JoinRoomActions,
  LeaveRoomActions,
  RoomDetailActions,
  SaveRoomActions,
  UnsaveRoomActions,
} from '../../state/room-detail/room-detail.actions';
import {
  joiningButtonState,
  savingButtonState,
  selectCurrentRoom,
  selectRoomDetailError,
  selectRoomDetailLoading,
  selectLeaveButtonDisabled,
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
  faSpinner,
  faStopCircle,
  faTrashAlt,
  faCopy,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { JwtService } from '../../../../core/services/jwt.service';

import * as fromInstance from '../../state/instance'; // Corrected path

import { Clipboard } from '@angular/cdk/clipboard';
// The RoomDetailComponent's purpose is to display detailed information about a specific room
// with the ID coming from the URL parameter.
@Component({
  selector: 'app-room-detail',
  standalone: false,
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss'], // Changed from styleUrl
})
export class RoomDetailComponent implements OnInit, OnDestroy {
  public room$!: Observable<RoomModel | null>;
  public isLoadingRoom$!: Observable<boolean>; // Renamed to avoid conflict
  public roomError$!: Observable<string | null>; // Renamed
  // Instance State Observables
  instanceId$!: Observable<string | null>;
  lifecycleStatus$!: Observable<fromInstance.InstanceState['lifecycleStatus']>;
  isOperationInProgress$!: Observable<boolean>;
  instanceDisplayInfo$!: Observable<any>; // Using 'any' for now, refine with a specific model if needed
  
  // NEW: Redesigned selectors for professional UI
  primaryActionButton$!: Observable<{ text: string; disabled: boolean; variant: string }>;
  smallActionButtons$!: Observable<{ pause?: { text: string; disabled: boolean }; terminate?: { text: string; disabled: boolean } }>;
  progressBar$!: Observable<{ show: boolean; progress: number; variant: string }>;
  statusMessage$!: Observable<{ status: string; phase: string; message: string; progress: number; ipAddress: string | null; isError: boolean; showProgress: boolean; }>;
  
  // OLD: Keep for backward compatibility during transition
  launchButtonState$!: Observable<{ text: string; disabled: boolean }>;
  startButtonState$!: Observable<{ text: string; disabled: boolean }>;
  stopButtonState$!: Observable<{ text: string; disabled: boolean }>;
  terminateButtonState$!: Observable<{ text: string; disabled: boolean }>;

  userId!: string;
  private roomId!: string;

  // Modal state
  showLeaveConfirmModal: boolean = false;

  joinButtonState$!: Observable<string | undefined>;
  saveButtonState$!: Observable<string | undefined>;

  // Add this new observable
  leaveButtonDisabled$!: Observable<boolean>;

  public isDisabled: boolean = false; // For the leave button

  private destroy$ = new Subject<void>();

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
  faSpinner = faSpinner;

  faStopCircle = faStopCircle;
  faTrashAlt = faTrashAlt;
  faCopy = faCopy;
  faCircleNotch = faCircleNotch;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private jwtService: JwtService,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    
    this.getUserIdAndRoomId();
    this.selectRoomDetailState();
    this.selectInstanceState(); // Initialize instance state selectors
    this.loadRoomAndInstanceDetails();
  }

  private getUserIdAndRoomId(): void {
    // this.userId = this.jwtService.getUserIdFromToken();
    // this.roomId = +this.route.snapshot.params['id'];
    this.userId = this.jwtService.getUserIdFromToken()?.toString() || '';
    this.roomId = this.route.snapshot.params['id']?.toString() || '';

    if (!this.userId) {
      console.error(
        'User ID is missing. Cannot proceed with instance operations.'
      );
      // Handle error, e.g., redirect to login or show error message
    }
    if (!this.roomId) {
      console.error('Room ID is missing from route. Cannot load details.');
    }
  }

  private selectRoomDetailState(): void {
    this.room$ = this.store.select(selectCurrentRoom);
    this.isLoadingRoom$ = this.store.select(selectRoomDetailLoading);
    this.roomError$ = this.store.select(selectRoomDetailError);
    this.joinButtonState$ = this.store.select(joiningButtonState);
    this.saveButtonState$ = this.store.select(savingButtonState);
    
    // Add this new selector
    this.leaveButtonDisabled$ = this.store.select(selectLeaveButtonDisabled);
  }
  private selectInstanceState(): void {
    this.instanceId$ = this.store.select(fromInstance.selectInstanceId);
    this.lifecycleStatus$ = this.store.select(
      fromInstance.selectLifecycleStatus
    );
    this.isOperationInProgress$ = this.store.select(
      fromInstance.selectIsOperationInProgress
    );
    this.instanceDisplayInfo$ = this.store.select(
      fromInstance.selectInstanceDisplayInfo
    );    // NEW: Professional redesigned selectors
    this.primaryActionButton$ = this.store.select(
      fromInstance.selectPrimaryActionButton
    );
    this.smallActionButtons$ = this.store.select(
      fromInstance.selectSmallActionButtons
    );
    this.progressBar$ = this.store.select(
      fromInstance.selectProgressBar
    );
    this.statusMessage$ = this.store.select(fromInstance.selectInstanceDisplayInfo);

    // OLD: Keep for backward compatibility
    this.launchButtonState$ = this.store.select(
      fromInstance.selectLaunchButtonState
    );
    this.startButtonState$ = this.store.select(
      fromInstance.selectStartButtonState
    );
    this.stopButtonState$ = this.store.select(
      fromInstance.selectStopButtonState
    );
    this.terminateButtonState$ = this.store.select(
      fromInstance.selectTerminateButtonState
    );
  }

  public loadRoomAndInstanceDetails(): void {
    if (this.roomId && this.userId) {
      this.store.dispatch(
        RoomDetailActions.loadRoomDetail({ roomId: +this.roomId })
      );

      // Load instance details with userId
      this.store.dispatch(
        fromInstance.InstanceActions.loadInstanceDetailsForRoom({
          roomId: this.roomId,
        })
      );
    } else {
      console.error('Missing roomId or userId for loading details');
    }
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
    this.store.dispatch(
      SaveRoomActions.saveRoom({ userId: +this.userId, roomId: +this.roomId })
    );
  }

  public unsaveRoom() {
    this.store.dispatch(
      UnsaveRoomActions.unsaveRoom({
        userId: +this.userId,
        roomId: +this.roomId,
      })
    );
  }
  public joinRoom() {
    this.store.dispatch(
      JoinRoomActions.joinRoom({ userId: +this.userId, roomId: +this.roomId })
    );
  }

  public leaveRoom() {
    // Check if leaving should be blocked before showing modal
    this.leaveButtonDisabled$.pipe(take(1)).subscribe(isDisabled => {
      if (!isDisabled) {
        this.showLeaveConfirmModal = true;
      } else {
        console.log('Cannot leave room while instance operation is in progress');
        // Optionally show a toast message here
      }
    });
  }

  public confirmLeaveRoom() {
    this.showLeaveConfirmModal = false;

    // Check if there's an instance to terminate first
    this.instanceId$.pipe(take(1)).subscribe(instanceId => {
      if (instanceId) {        
        // Then terminate instance (this will not trigger leave again due to the effect filter)
        this.store.dispatch(
          fromInstance.InstanceActions.terminateInstanceBeforeLeave({
            instanceId,
            userId: this.userId,
            roomId: this.roomId,
          })
        );
      } else {
        // No instance - leave immediately
        this.store.dispatch(
          LeaveRoomActions.leaveRoom({ userId: +this.userId, roomId: +this.roomId })
        );
      }
    });
  }

  // Keep the simple termination for ngOnDestroy
  private terminateCurrentInstance(): void {
    this.instanceId$.pipe(take(1)).subscribe(instanceId => {
      if (instanceId) {
        console.log(`Terminating current instance ${instanceId}`);
        this.handleTerminateInstance(instanceId);
      }
    });
  }

  public cancelLeaveRoom() {
    this.showLeaveConfirmModal = false;
  }
  // Helper method to calculate completed challenges based on percentage
  public getCompletedChallenges(room: RoomModel): number {
    if (!room.totalChallenges) return 0;
    return Math.round((room.percentageCompleted / 100) * room.totalChallenges);
  }

  handleLaunchInstance(): void {
    if (!this.userId || !this.roomId) {
      console.error('Missing userId or roomId for launching instance.');
      return;
    }
    this.store.dispatch(
      fromInstance.InstanceActions.launchInstance({
        roomId: this.roomId,
        userId: this.userId,
      })
    );
  }

  handleStartInstance(instanceId: string | null): void {
    if (instanceId && this.userId && this.roomId) {
      this.store.dispatch(
        fromInstance.InstanceActions.startInstance({
          instanceId,
          userId: this.userId,
          roomId: this.roomId,
        })
      );
    } else {
      console.error(
        'Cannot start instance: missing instanceId, userId, or roomId.'
      );
    }
  }

  handleStopInstance(instanceId: string | null): void {
    if (instanceId && this.userId && this.roomId) {
      this.store.dispatch(
        fromInstance.InstanceActions.stopInstance({
          instanceId,
          userId: this.userId,
          roomId: this.roomId,
        })
      );
    } else {
      console.error(
        'Cannot stop instance: missing instanceId, userId, or roomId.'
      );
    }
  }

  handleTerminateInstance(instanceId: string | null): void {
    if (instanceId && this.userId && this.roomId) {
      this.store.dispatch(
        fromInstance.InstanceActions.terminateInstance({
          instanceId,
          userId: this.userId,
          roomId: this.roomId,
        })
      );
    } else {
      console.error(
        'Cannot terminate instance: missing instanceId, userId, or roomId.'
      );
    }
  }
  copyIpAddress(ipAddress?: string | null): void {
    if (ipAddress) {
      this.clipboard.copy(ipAddress);
      // Optionally, show a toast notification "IP Copied!"
      console.log('IP Address copied to clipboard:', ipAddress);
    }
  }

  // NEW: Redesigned action handlers for professional UI
  handlePrimaryAction(variant: string): void {
    if (variant === 'launch' || variant === 'launching') {
      this.handleLaunchInstance();
    } else if (variant === 'start' || variant === 'starting') {
      this.instanceId$.pipe(takeUntil(this.destroy$)).subscribe(instanceId => {
        if (instanceId) {
          this.handleStartInstance(instanceId);
        }
      });
    }
  }

  handlePauseInstance(): void {
    this.instanceId$.pipe(takeUntil(this.destroy$)).subscribe(instanceId => {
      if (instanceId) {
        this.handleStopInstance(instanceId);
      }
    });
  }

  handleTerminateInstanceAction(): void {
    this.instanceId$.pipe(takeUntil(this.destroy$)).subscribe(instanceId => {
      if (instanceId) {
        this.handleTerminateInstance(instanceId);
      }
    });
  }

  ngOnDestroy(): void {
    // Terminate current instance before destroying component
    this.terminateCurrentInstance();

    // Clear states
    this.store.dispatch(RoomDetailActions.clearRoomDetail());
    this.store.dispatch(fromInstance.InstanceActions.clearInstanceState());
    this.destroy$.next();
    this.destroy$.complete();
  }
}
