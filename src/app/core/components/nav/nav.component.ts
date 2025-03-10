import { Component, OnInit } from '@angular/core';
import { faCube, faDoorOpen, faUser, faChevronDown, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../features/auth/state/auth.actions';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { selectAuthState } from '../../../features/auth/state/auth.selectors';
import { JwtService } from '../../../features/auth/services/jwt.service';

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

  constructor(private store: Store, private router: Router, private jwtService: JwtService) {}

  ngOnInit(): void {
    const token: any = localStorage.getItem('access-token');
    const decoded: any = this.jwtService.decodeToken(token);
    this.username = decoded.sub;
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
