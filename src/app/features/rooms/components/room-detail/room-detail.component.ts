import { Component, OnDestroy, OnInit, Renderer2, ViewContainerRef, ComponentRef, Injector, TemplateRef, ViewChild, ElementRef } from '@angular/core';
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
  faPlay,
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
  faKey,
  faDownload,
  faInfoCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { JwtService } from '../../../../core/services/jwt.service';

import * as fromInstance from '../../state/instance'; // Corrected path
import * as fromVpn from '../../state/vpn'; // Import VPN state

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
  leaveButtonDisabled$!: Observable<boolean>;  // VPN state
  showVpnGuide: boolean = false;
  selectedOS: string = 'windows';  isDownloadingVpnConfig$!: Observable<boolean>;
  
  // VPN Portal Management
  private vpnPortalElement: HTMLElement | null = null;

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
  faPlay = faPlay;
  faSignOutAlt = faSignOutAlt;
  faSpinner = faSpinner;

  faStopCircle = faStopCircle;
  faTrashAlt = faTrashAlt;
  faCopy = faCopy;
  faCircleNotch = faCircleNotch;

  // VPN icons
  faKey = faKey;
  faDownload = faDownload;
  faInfoCircle = faInfoCircle;
  faTimes = faTimes;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private jwtService: JwtService,
    private clipboard: Clipboard,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector
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

    // VPN state selectors
    this.isDownloadingVpnConfig$ = this.store.select(
      fromVpn.selectIsDownloadingVpnConfig
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

  // // Keep the simple termination for ngOnDestroy
  // private terminateCurrentInstance(): void {
  //   this.instanceId$.pipe(take(1)).subscribe(instanceId => {
  //     if (instanceId) {
  //       console.log(`Terminating current instance ${instanceId}`);
  //       this.handleTerminateInstance(instanceId);
  //     }
  //   });
  // }

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
      this.instanceId$.pipe(take(1)).subscribe(instanceId => { // ✅ Changed to take(1)
        if (instanceId) {
          this.handleStartInstance(instanceId);
        }
      });
    }
  }

  handlePauseInstance(): void {
    this.instanceId$.pipe(take(1)).subscribe(instanceId => { // ✅ Changed to take(1)
      if (instanceId) {
        this.handleStopInstance(instanceId);
      }
    });
  }

  handleTerminateInstanceAction(): void {
    this.instanceId$.pipe(take(1)).subscribe(instanceId => { // ✅ Changed to take(1)
      if (instanceId) {
        this.handleTerminateInstance(instanceId);
      }
    });
  }  // VPN methods
  toggleVpnGuide(): void {
    if (this.showVpnGuide) {
      this.closeVpnGuide();
    } else {
      this.showVpnGuide = true;
      this.createVpnPortal();
    }
  }

  closeVpnGuide(): void {
    this.showVpnGuide = false;
    this.destroyVpnPortal();
  }

  selectOS(os: string): void {
    this.selectedOS = os;
    this.updateVpnGuideContent();
  }

  downloadVpnConfig(): void {
  
      this.store.dispatch(fromVpn.VpnActions.downloadConfig({ username: "openvpn" }));

  }

  private createVpnPortal(): void {
    if (this.vpnPortalElement) {
      this.destroyVpnPortal();
    }

    // Create the main container with exact same structure as before
    this.vpnPortalElement = this.renderer.createElement('div');
    this.renderer.addClass(this.vpnPortalElement, 'vpn-guide-overlay');
    
    // Apply the exact styles from CSS
    this.renderer.setStyle(this.vpnPortalElement, 'position', 'fixed');
    this.renderer.setStyle(this.vpnPortalElement, 'top', '0');
    this.renderer.setStyle(this.vpnPortalElement, 'left', '0');
    this.renderer.setStyle(this.vpnPortalElement, 'right', '0');
    this.renderer.setStyle(this.vpnPortalElement, 'bottom', '0');
    this.renderer.setStyle(this.vpnPortalElement, 'background', 'rgba(0, 0, 0, 0.75)');
    this.renderer.setStyle(this.vpnPortalElement, 'z-index', '99999');
    this.renderer.setStyle(this.vpnPortalElement, 'display', 'flex');
    this.renderer.setStyle(this.vpnPortalElement, 'justify-content', 'flex-end');

    // Create the sidebar
    const sidebar = this.renderer.createElement('div');
    this.renderer.addClass(sidebar, 'vpn-guide-sidebar');
    this.renderer.setStyle(sidebar, 'width', '25%');
    this.renderer.setStyle(sidebar, 'min-width', '380px');
    this.renderer.setStyle(sidebar, 'background', 'var(--my-space-card-background)');
    this.renderer.setStyle(sidebar, 'border-left', '1px solid rgba(255, 255, 255, 0.15)');
    this.renderer.setStyle(sidebar, 'padding', '2rem');
    this.renderer.setStyle(sidebar, 'overflow-y', 'auto');
    this.renderer.setStyle(sidebar, 'display', 'flex');
    this.renderer.setStyle(sidebar, 'flex-direction', 'column');
    this.renderer.setStyle(sidebar, 'gap', '1.8rem');
    this.renderer.setStyle(sidebar, 'box-shadow', '-8px 0 32px rgba(0, 0, 0, 0.3)');
    this.renderer.setStyle(sidebar, 'font-size', '0.9rem');
    this.renderer.setStyle(sidebar, 'line-height', '1.6');
    this.renderer.setStyle(sidebar, 'z-index', '99999');

    // Create header
    const header = this.renderer.createElement('div');
    this.renderer.addClass(header, 'guide-header');
    this.renderer.setStyle(header, 'display', 'flex');
    this.renderer.setStyle(header, 'align-items', 'center');
    this.renderer.setStyle(header, 'justify-content', 'space-between');
    this.renderer.setStyle(header, 'border-bottom', '1px solid rgba(255, 255, 255, 0.12)');
    this.renderer.setStyle(header, 'padding-bottom', '1.2rem');

    const title = this.renderer.createElement('h2');
    this.renderer.setStyle(title, 'margin', '0');
    this.renderer.setStyle(title, 'color', 'var(--my-space-text-color)');
    this.renderer.setStyle(title, 'font-size', '1.4rem');
    this.renderer.setStyle(title, 'font-weight', '600');
    this.renderer.setStyle(title, 'letter-spacing', '-0.02em');
    const titleText = this.renderer.createText('VPN Setup Guide');
    this.renderer.appendChild(title, titleText);

    const closeBtn = this.renderer.createElement('button');
    this.renderer.addClass(closeBtn, 'close-guide-btn');
    this.renderer.setStyle(closeBtn, 'background', 'none');
    this.renderer.setStyle(closeBtn, 'border', '1px solid rgba(255, 255, 255, 0.15)');
    this.renderer.setStyle(closeBtn, 'color', 'rgba(255, 255, 255, 0.7)');
    this.renderer.setStyle(closeBtn, 'border-radius', '50%');
    this.renderer.setStyle(closeBtn, 'width', '2rem');
    this.renderer.setStyle(closeBtn, 'height', '2rem');
    this.renderer.setStyle(closeBtn, 'display', 'flex');
    this.renderer.setStyle(closeBtn, 'align-items', 'center');
    this.renderer.setStyle(closeBtn, 'justify-content', 'center');
    this.renderer.setStyle(closeBtn, 'cursor', 'pointer');
    this.renderer.setStyle(closeBtn, 'transition', 'all 0.2s ease');
    const closeIcon = this.renderer.createText('×');
    this.renderer.appendChild(closeBtn, closeIcon);

    // Attach click events
    this.renderer.listen(this.vpnPortalElement, 'click', () => this.closeVpnGuide());
    this.renderer.listen(sidebar, 'click', (event) => event.stopPropagation());
    this.renderer.listen(closeBtn, 'click', () => this.closeVpnGuide());

    // Create OS selection
    const osSelection = this.renderer.createElement('div');
    this.renderer.addClass(osSelection, 'os-selection');

    const osTitle = this.renderer.createElement('h3');
    this.renderer.setStyle(osTitle, 'margin', '0 0 1.2rem 0');
    this.renderer.setStyle(osTitle, 'color', 'var(--my-space-text-color)');
    this.renderer.setStyle(osTitle, 'font-size', '1.1rem');
    this.renderer.setStyle(osTitle, 'font-weight', '500');
    const osTitleText = this.renderer.createText('What Operating System are you using?');
    this.renderer.appendChild(osTitle, osTitleText);

    const osButtons = this.renderer.createElement('div');
    this.renderer.addClass(osButtons, 'os-buttons');
    this.renderer.setStyle(osButtons, 'display', 'flex');
    this.renderer.setStyle(osButtons, 'gap', '0.6rem');
    this.renderer.setStyle(osButtons, 'flex-wrap', 'wrap');

    // Create OS buttons
    const osOptions = [
      { value: 'windows', label: 'Windows' },
      { value: 'linux', label: 'Linux' },
      { value: 'macos', label: 'MacOS' }
    ];

    osOptions.forEach(os => {
      const btn = this.renderer.createElement('button');
      this.renderer.addClass(btn, 'instance-btn');
      this.renderer.addClass(btn, 'primary-btn');
      
      this.renderer.setStyle(btn, 'flex', '1');
      this.renderer.setStyle(btn, 'height', '1.78rem');
      this.renderer.setStyle(btn, 'min-width', '50px');
      this.renderer.setStyle(btn, 'font-size', '0.85rem');
      this.renderer.setStyle(btn, 'padding', '0.3rem 0.6rem');
      this.renderer.setStyle(btn, 'background', 'rgba(255, 255, 255, 0.08)');
      this.renderer.setStyle(btn, 'border', '1px solid rgba(255, 255, 255, 0.15)');
      this.renderer.setStyle(btn, 'color', 'rgba(255, 255, 255, 0.85)');
      this.renderer.setStyle(btn, 'transition', 'all 0.2s ease');
      this.renderer.setStyle(btn, 'border-radius', '0.3rem');
      this.renderer.setStyle(btn, 'cursor', 'pointer');

      if (this.selectedOS === os.value) {
        this.renderer.setStyle(btn, 'background', '#199563c5');
        this.renderer.setStyle(btn, 'color', 'white');
        this.renderer.setStyle(btn, 'border-color', '#13764fc5');
      }

      const btnText = this.renderer.createText(os.label);
      this.renderer.appendChild(btn, btnText);
      
      this.renderer.listen(btn, 'click', () => this.selectOS(os.value));
      this.renderer.appendChild(osButtons, btn);
    });

    // Create guide content container
    const guideContent = this.renderer.createElement('div');
    this.renderer.addClass(guideContent, 'guide-content');
    this.renderer.setStyle(guideContent, 'flex', '1');

    // Assemble the structure
    this.renderer.appendChild(header, title);
    this.renderer.appendChild(header, closeBtn);
    this.renderer.appendChild(osSelection, osTitle);
    this.renderer.appendChild(osSelection, osButtons);
    this.renderer.appendChild(sidebar, header);
    this.renderer.appendChild(sidebar, osSelection);
    this.renderer.appendChild(sidebar, guideContent);
    this.renderer.appendChild(this.vpnPortalElement, sidebar);

    // Append to document body
    this.renderer.appendChild(document.body, this.vpnPortalElement);

    // Set the content for the current OS
    this.updateVpnGuideContent();
  }  private updateVpnGuideContent(): void {
    if (!this.vpnPortalElement) return;

    const guideContent = this.vpnPortalElement.querySelector('.guide-content');
    if (!guideContent) return;

    // Clear existing content
    guideContent.innerHTML = '';

    // Create the OS guide container
    const osGuide = this.renderer.createElement('div');
    this.renderer.addClass(osGuide, 'os-guide');
    this.renderer.setStyle(osGuide, 'color', 'var(--my-space-text-color)');

    // Create the ordered list
    const ol = this.renderer.createElement('ol');
    this.renderer.setStyle(ol, 'padding-left', '1.4rem');
    this.renderer.setStyle(ol, 'counter-reset', 'step-counter');

    let steps: any[] = [];
    
    if (this.selectedOS === 'windows') {
      steps = [
        { text: 'Download your OpenVPN configuration pack.' },
        { 
          text: 'Download the OpenVPN GUI application.',
          link: { url: 'https://openvpn.net/community-downloads', text: 'Download' }
        },
        { text: 'Install the OpenVPN GUI application. Then open the installer file and follow the setup wizard.' },
        { text: 'Open and run the OpenVPN GUI application as Administrator.' },
        { text: 'The application will start running in the system tray. It\'s at the bottom of your screen, near the clock. Right click on the application and click Import File.' },
        { text: 'Select the configuration file you downloaded earlier.' },
        { text: 'Now right click on the application again, select your file and click Connect' }
      ];
    } else if (this.selectedOS === 'linux') {
      steps = [
        { text: 'Download your OpenVPN configuration pack.' },
        { text: 'Run the following command in your terminal: ', code: 'sudo apt install openvpn' },
        { text: 'Locate the full path to your VPN configuration file (normally in your ~/Downloads folder).' },
        { text: 'Use your OpenVPN file with the following command: ', code: 'sudo openvpn /path/to/file.ovpn' }
      ];
    } else if (this.selectedOS === 'macos') {
      steps = [
        { text: 'Download your OpenVPN configuration pack.' },
        { 
          text: 'Download and install Tunnelblick (free OpenVPN client for Mac).',
          link: { url: 'https://tunnelblick.net/downloads.html', text: 'Tunnelblick' }
        },
        { text: 'Double-click your .ovpn file to import it into Tunnelblick.' },
        { text: 'Click on the Tunnelblick icon in your menu bar and select your configuration to connect.' }
      ];
    }

    steps.forEach(step => {
      const li = this.renderer.createElement('li');
      this.renderer.setStyle(li, 'margin-bottom', '1rem');
      this.renderer.setStyle(li, 'line-height', '1.65');
      this.renderer.setStyle(li, 'position', 'relative');
      this.renderer.setStyle(li, 'padding-left', '0.5rem');
      this.renderer.setStyle(li, 'color', 'rgba(255, 255, 255, 0.9)');
      
      // Handle text with potential links and code
      if (step.link) {
        // Split text around the link placeholder
        const beforeLink = step.text.substring(0, step.text.indexOf(step.link.text));
        const afterLink = step.text.substring(step.text.indexOf(step.link.text) + step.link.text.length);
        
        if (beforeLink) {
          const beforeText = this.renderer.createText(beforeLink);
          this.renderer.appendChild(li, beforeText);
        }
        
        // Create clickable link
        const link = this.renderer.createElement('a');
        this.renderer.setProperty(link, 'href', step.link.url);
        this.renderer.setProperty(link, 'target', '_blank');
        this.renderer.setProperty(link, 'rel', 'noopener noreferrer');
        this.renderer.setStyle(link, 'color', '#1cff86c5');
        this.renderer.setStyle(link, 'text-decoration', 'none');
        this.renderer.setStyle(link, 'border-bottom', '1px solid transparent');
        this.renderer.setStyle(link, 'transition', 'border-color 0.2s ease');
        
        // Add hover effect
        this.renderer.listen(link, 'mouseenter', () => {
          this.renderer.setStyle(link, 'border-bottom-color', '#1cff86c5');
        });
        this.renderer.listen(link, 'mouseleave', () => {
          this.renderer.setStyle(link, 'border-bottom-color', 'transparent');
        });
        
        const linkText = this.renderer.createText(step.link.text);
        this.renderer.appendChild(link, linkText);
        this.renderer.appendChild(li, link);
        
        if (afterLink) {
          const afterText = this.renderer.createText(afterLink);
          this.renderer.appendChild(li, afterText);
        }
      } else if (step.code) {
        // Handle text with code
        const beforeCode = step.text;
        const beforeText = this.renderer.createText(beforeCode);
        this.renderer.appendChild(li, beforeText);
        
        const code = this.renderer.createElement('code');
        this.renderer.setStyle(code, 'background', '#012712c5');
        this.renderer.setStyle(code, 'border', '1px solid #1cff86c5');
        this.renderer.setStyle(code, 'padding', '0.3rem 0.6rem');
        this.renderer.setStyle(code, 'border-radius', '4px');
        this.renderer.setStyle(code, 'font-family', '"Monaco", "Menlo", "Ubuntu Mono", monospace');
        this.renderer.setStyle(code, 'color', '#1cff86c5');
        this.renderer.setStyle(code, 'font-size', '0.85em');
        this.renderer.setStyle(code, 'font-weight', '500');
        const codeText = this.renderer.createText(step.code);
        this.renderer.appendChild(code, codeText);
        this.renderer.appendChild(li, code);
      } else {
        // Handle plain text
        const textNode = this.renderer.createText(step.text);
        this.renderer.appendChild(li, textNode);
      }
      
      this.renderer.appendChild(ol, li);
    });

    // Create troubleshooting section
    const troubleshooting = this.renderer.createElement('div');
    this.renderer.addClass(troubleshooting, 'troubleshooting');
    this.renderer.setStyle(troubleshooting, 'margin-top', '2.5rem');
    this.renderer.setStyle(troubleshooting, 'padding-top', '1.5rem');
    this.renderer.setStyle(troubleshooting, 'border-top', '1px solid rgba(255, 255, 255, 0.12)');

    const troubleshootingTitle = this.renderer.createElement('h4');
    this.renderer.setStyle(troubleshootingTitle, 'margin', '0 0 1.2rem 0');
    this.renderer.setStyle(troubleshootingTitle, 'color', 'var(--my-space-text-color)');
    this.renderer.setStyle(troubleshootingTitle, 'font-size', '1.05rem');
    this.renderer.setStyle(troubleshootingTitle, 'font-weight', '600');
    this.renderer.setStyle(troubleshootingTitle, 'display', 'flex');
    this.renderer.setStyle(troubleshootingTitle, 'align-items', 'center');
    this.renderer.setStyle(troubleshootingTitle, 'gap', '0.5rem');
    const warningIcon = this.renderer.createText('⚠️ Having Problems?');
    this.renderer.appendChild(troubleshootingTitle, warningIcon);

    const troubleshootingList = this.renderer.createElement('ul');
    this.renderer.setStyle(troubleshootingList, 'padding-left', '1.4rem');

    const troubleshootingItems = [
      { 
        text: 'If you can access 10.10.10.10, you\'re connected.',
        link: { url: 'http://10.10.10.10/', text: '10.10.10.10' }
      },
      { 
        text: 'Downloading and getting a 404? Go the access page and switch VPN servers.',
        link: { url: 'https://tryhackme.com/access', text: 'access' }
      },
      { 
        text: 'Getting inline cert error? Go the access page and switch VPN servers.',
        link: { url: 'https://tryhackme.com/access', text: 'access' }
      },
      { text: 'If you are using a virtual machine, you will need to run the VPN inside that machine.' },
      { text: 'Is the OpenVPN client running as root? (On Windows, run OpenVPN GUI as administrator. On Linux, run with sudo).' },
      { text: 'Have you restarted your VM?' },
      { text: 'Is your OpenVPN up-to-date?' },
      { text: 'Only 1 OpenVPN connection is allowed. (Run - ps aux | grep openvpn are there 2 VPN sessions running?).' },
      { 
        text: 'Still having issues? Check our docs out.',
        link: { url: 'https://help.tryhackme.com/en/articles/6496029-openvpn-general-troubleshooting', text: 'docs' }
      }
    ];

    troubleshootingItems.forEach(item => {
      const li = this.renderer.createElement('li');
      this.renderer.setStyle(li, 'margin-bottom', '0.8rem');
      this.renderer.setStyle(li, 'line-height', '1.6');
      this.renderer.setStyle(li, 'font-size', '0.85rem');
      this.renderer.setStyle(li, 'color', 'rgba(255, 255, 255, 0.8)');
      
      if (item.link) {
        // Split text around the link
        const beforeLink = item.text.substring(0, item.text.indexOf(item.link.text));
        const afterLink = item.text.substring(item.text.indexOf(item.link.text) + item.link.text.length);
        
        if (beforeLink) {
          const beforeText = this.renderer.createText(beforeLink);
          this.renderer.appendChild(li, beforeText);
        }
        
        // Create clickable link
        const link = this.renderer.createElement('a');
        this.renderer.setProperty(link, 'href', item.link.url);
        this.renderer.setProperty(link, 'target', '_blank');
        this.renderer.setProperty(link, 'rel', 'noopener noreferrer');
        this.renderer.setStyle(link, 'color', '#1cff86c5');
        this.renderer.setStyle(link, 'text-decoration', 'none');
        this.renderer.setStyle(link, 'border-bottom', '1px solid transparent');
        this.renderer.setStyle(link, 'transition', 'border-color 0.2s ease');
        
        // Add hover effect
        this.renderer.listen(link, 'mouseenter', () => {
          this.renderer.setStyle(link, 'border-bottom-color', '#1cff86c5');
        });
        this.renderer.listen(link, 'mouseleave', () => {
          this.renderer.setStyle(link, 'border-bottom-color', 'transparent');
        });
        
        const linkText = this.renderer.createText(item.link.text);
        this.renderer.appendChild(link, linkText);
        this.renderer.appendChild(li, link);
        
        if (afterLink) {
          const afterText = this.renderer.createText(afterLink);
          this.renderer.appendChild(li, afterText);
        }
      } else {
        // Handle plain text
        const itemText = this.renderer.createText(item.text);
        this.renderer.appendChild(li, itemText);
      }
      
      this.renderer.appendChild(troubleshootingList, li);
    });

    // Assemble troubleshooting section
    this.renderer.appendChild(troubleshooting, troubleshootingTitle);
    this.renderer.appendChild(troubleshooting, troubleshootingList);

    // Assemble the guide
    this.renderer.appendChild(osGuide, ol);
    this.renderer.appendChild(osGuide, troubleshooting);
    this.renderer.appendChild(guideContent, osGuide);

    // Update OS button states
    const osButtons = this.vpnPortalElement.querySelectorAll('.os-buttons button');
    osButtons.forEach((btn: any, index) => {
      const osValues = ['windows', 'linux', 'macos'];
      if (osValues[index] === this.selectedOS) {
        this.renderer.setStyle(btn, 'background', '#199563c5');
        this.renderer.setStyle(btn, 'color', 'white');
        this.renderer.setStyle(btn, 'border-color', '#13764fc5');
      } else {
        this.renderer.setStyle(btn, 'background', 'rgba(255, 255, 255, 0.08)');
        this.renderer.setStyle(btn, 'color', 'rgba(255, 255, 255, 0.85)');
        this.renderer.setStyle(btn, 'border-color', 'rgba(255, 255, 255, 0.15)');
      }
    });
  }

  private destroyVpnPortal(): void {
    if (this.vpnPortalElement) {
      this.renderer.removeChild(document.body, this.vpnPortalElement);
      this.vpnPortalElement = null;
    }
  }

  ngOnDestroy(): void {
    console.log('🔴 COMPONENT DESTROYED');
    console.log('🔴 Stack trace:', new Error().stack); // ← CRUCIAL
  
    // Clean up VPN portal
    this.destroyVpnPortal();

    // // Terminate current instance before destroying component
    // this.terminateCurrentInstance();

    // Clear states
    this.store.dispatch(RoomDetailActions.clearRoomDetail());
    this.store.dispatch(fromInstance.InstanceActions.clearInstanceState());
    this.destroy$.next();
    this.destroy$.complete();
  }
}
