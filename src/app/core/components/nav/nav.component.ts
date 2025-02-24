import { Component } from '@angular/core';
import { faCube, faDoorOpen, faUser, faChevronDown, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../features/auth/state/auth.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: false,
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  // Font Awesome icons
  faCube = faCube;
  faDoorOpen = faDoorOpen;
  faUser = faUser;
  faChevronDown = faChevronDown;
  faSignOutAlt = faSignOutAlt;

  constructor(private store: Store, private router: Router) {}

  onLogout(): void {
    // Clear storage
    localStorage.removeItem('access-token');
    localStorage.removeItem('token-expires-at');
    
    // Reset state and redirect
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/auth/login']);
  }
}
