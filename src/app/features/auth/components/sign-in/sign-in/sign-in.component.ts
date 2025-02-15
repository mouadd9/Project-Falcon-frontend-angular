import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { faEnvelope, faLock, faEye, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-sign-in',
  standalone: false,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  // Font Awesome icons
  faEnvelope = faEnvelope;
  faLock = faLock;
  faEye = faEye;
  faCheck = faCheck;
  faGoogle = faGoogle;

  // we will inject the router service 
  constructor(private authService : AuthService){}


  onLogin() {
    // Temporary navigation until implementation
    console.log("signing in...");
    this.authService.signIn();
  }
}


  /**
   * Authentication Flow Plan:
   * 
   * 1. Form Validation
   *    - Validate email format and required fields
   *    - Password minimum requirements check
   *    - Show validation errors if any
   * 
   * 2. State Management (NgRx Implementation)
   *    a. Actions:
   *       - LOGIN_REQUEST: Dispatch with credentials
   *       - LOGIN_SUCCESS: Contains user data & tokens
   *       - LOGIN_FAILURE: Contains error details
   * 
   *    b. Effects:
   *       - Handle API calls via AuthService
   *       - Manage success/failure responses
   *       - Handle token storage
   * 
   *    c. Reducers:
   *       - Update auth state
   *       - Store user information
   *       - Track loading/error states
   * 
   * 3. Security & Storage
   *    - Store JWT in HttpOnly cookies
   *    - Implement refresh token logic
   *    - Clear sensitive data on logout
   * 
   * 4. Error Handling
   *    - Network errors
   *    - Invalid credentials
   *    - Account status issues
   * 
   * 5. Post-Login
   *    - Route to dashboard
   *    - Load user preferences
   *    - Set up interceptors for auth headers
   * 
   * 6. Route Guards
   *    - Protect routes based on auth state
   *    - Check token expiration
   *    - Handle unauthorized access
   */