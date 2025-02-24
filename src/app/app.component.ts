import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthActions } from './features/auth/state/auth.actions';
import { selectAuthState } from './features/auth/state/auth.selectors';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  showNavBar$!: Observable<boolean>;
  private tokenCheckSubscription?: Subscription;
  private authStateSubscription?: Subscription;


  constructor(private router: Router, private store: Store) {
    // Set up router event subscription in constructor
    this.showNavBar$ = this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        const isAuthRoute = event.urlAfterRedirects.includes('/auth');
        return !isAuthRoute;
      })
    );

    // Listen to auth state changes
    this.authStateSubscription = this.store.select(selectAuthState)
      .subscribe(state => {
        if (state.token) {
          console.log('Auth state changed - token present, starting timer');
          this.startExpirationTimer();
        } else {
          console.log('Auth state changed - no token, stopping timer');
          this.stopExpirationTimer();
        }
      });



  }

  ngOnInit(): void {
    // Check token and its expiration
    this.checkTokenAndRestore();
  }

  private checkTokenAndRestore(): void {
    const token = localStorage.getItem('access-token');
    const expiresAt = localStorage.getItem('token-expires-at');

    if (!token || !expiresAt) {
      // No token or expiration found, ensure logged out state
      this.handleTokenExpiration();
      return;
    }

    const expirationTime = parseInt(expiresAt, 10);
    if (Date.now() >= expirationTime) {
      // Token has expired
      this.handleTokenExpiration();
    } else {
      // Token is valid, restore auth state and start monitoring
      this.store.dispatch(AuthActions.updateAuthState());
      
      // If on auth route with valid token, redirect to protected area
      if (this.router.url.includes('/auth')) {
        this.router.navigate(['/my-space']);
      }

      // Start monitoring if not already monitoring
      this.startExpirationTimer();
    }
  }

  ngOnDestroy(): void {
    this.stopExpirationTimer();
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
  }

  private startExpirationTimer(): void {
    // Clean up existing subscription if any
    this.stopExpirationTimer();
    
    // Start new timer
    this.tokenCheckSubscription = interval(5000).subscribe(() => {
      console.log('Checking token expiration...');
      const token = localStorage.getItem('access-token');
      const expiresAt = localStorage.getItem('token-expires-at');
      
      if (!token || !expiresAt) {
        console.log('Token or expiration missing');
        this.handleTokenExpiration();
        return;
      }

      const expirationTime = parseInt(expiresAt, 10);
      const now = Date.now();
      console.log('Current time:', new Date(now).toISOString());
      console.log('Token expires:', new Date(expirationTime).toISOString());
      if (now >= expirationTime) {
        console.log('Token has expired');
        this.handleTokenExpiration();
      } else {
        console.log('Token still valid. Minutes remaining:', Math.round((expirationTime - now) / 60000));
      }
    });
    console.log('Started token expiration timer');
  }

  private stopExpirationTimer(): void {
    if (this.tokenCheckSubscription) {
      this.tokenCheckSubscription.unsubscribe();
      this.tokenCheckSubscription = undefined;
    }
  }

  private handleTokenExpiration(): void {
    console.log('Handling token expiration...');
    // Stop the timer
    this.stopExpirationTimer();
    
    // Clear storage
    localStorage.removeItem('access-token');
    localStorage.removeItem('token-expires-at');
    
    // Reset state and redirect
    this.store.dispatch(AuthActions.tokenExpired());
    this.router.navigate(['/auth/login']);
    console.log('Token expired, user logged out');
  }

}