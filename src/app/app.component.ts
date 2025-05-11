import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthActions } from './features/auth/state/auth.actions';
import { JwtService } from './core/services/jwt.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit/*, OnDestroy*/ {
  showNavBar$!: Observable<boolean>;
  
  constructor(private router: Router, private store: Store, private jwtService: JwtService) {
    // Set up router event subscription in constructor
    this.showNavBar$ = this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        const isAuthRoute = event.urlAfterRedirects.includes('/auth');
        return !isAuthRoute;
      })
    );
  }

  ngOnInit(): void {
    // Check token and its expiration
    this.restoreStateIfTokenStillValid();
  }

  private restoreStateIfTokenStillValid(): void {
    const token: any = localStorage.getItem('access-token'); // first retrieve token from local storage
    if (!token || this.jwtService.isTokenExpired(token)) { // if there is no token or the token is expired then 
      this.handleTokenExpiration();
    } else {
      this.store.dispatch(AuthActions.updateAuthState()); // Token is valid, restore auth state
      // If on auth route with valid token, redirect to protected area
      if (this.router.url.includes('/auth')) {
        this.router.navigate(['/my-space']);
      }
    }
  }

  private handleTokenExpiration(): void {
    console.log('Handling token expiration...');
    localStorage.removeItem('access-token'); // Clear storage
    this.router.navigate(['/auth/login']);
    console.log('Token expired, user logged out');
  } 

}