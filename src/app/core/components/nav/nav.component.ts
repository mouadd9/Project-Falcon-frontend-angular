import { Component, OnInit, HostListener } from '@angular/core';
import { faCube, faDoorOpen, faUser, faChevronDown, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../features/auth/state/auth.actions';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { selectAuthState } from '../../../features/auth/state/auth.selectors';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-nav',
  standalone: false,
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  // Font Awesome icons
  faCube = faCube;
  faDoorOpen = faDoorOpen;
  faUser = faUser;
  faChevronDown = faChevronDown;
  faSignOutAlt = faSignOutAlt;

  username: string = '';
  showProfileMenu: boolean = false;

  constructor(private store: Store, private router: Router, private jwtService: JwtService) {}

  ngOnInit(): void {
    this.initializeUserData();
  }
  
  private initializeUserData(): void {
    const token = localStorage.getItem('access-token');
    if (token) {
      const decoded = this.jwtService.decodeToken(token);
      this.username = decoded.sub;
    }
  }
  
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    // Close the profile menu if clicking outside the profile container
    if (this.showProfileMenu && !target.closest('.profile-container')) {
      this.showProfileMenu = false;
    }
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
    // Future implementation: show dropdown with logout option
  }

  onLogout(): void {
    // Clear storage
    localStorage.removeItem('access-token');
    localStorage.removeItem('token-expires-at');
    
    // Reset state and redirect
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/auth/login']);
  }
}
