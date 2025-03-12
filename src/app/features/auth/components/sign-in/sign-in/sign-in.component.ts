import { Component, OnInit } from '@angular/core';
import {
  faEnvelope,
  faLock,
  faEye,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { map, Observable, tap } from 'rxjs';
import { SignInFormValue, SignInRequest } from '../../../models/sign-in.model';
import { Store } from '@ngrx/store';
import { LogInFormActions } from '../../../state/auth.actions';
import { selectSignInButtonState } from '../../../state/auth.selectors';

@Component({
  selector: 'app-sign-in',
  standalone: false,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  // Font Awesome icons
  faEnvelope = faEnvelope;
  faLock = faLock;
  faEye = faEye;
  faCheck = faCheck;
  faGoogle = faGoogle;

  // Form Controls
  usernameCtrl!: FormControl;
  passwordCtrl!: FormControl; // associated to an input

  // Form Group
  signInForm!: FormGroup; // associated to a form

  statusChanges$!: Observable<any>;
  valueChanges$!: Observable<any>;

  showPassword = false;
  // isLoading = false;
  SignInButtonState$!: Observable<any>;

  // we will inject the router service
  constructor(private store: Store, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeFormControls();
    this.initializeFormGroup();
    this.selectState();
  }

  private initializeFormControls(): void {
    this.usernameCtrl = this.fb.control('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-Z0-9_-]*$'),
    ]);
    this.passwordCtrl = this.fb.control('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
      ),
    ]);
  }

  private initializeFormGroup(): void {
    this.signInForm = this.fb.group({
      username: this.usernameCtrl,
      password: this.passwordCtrl,
      termsAccepted: [false, [Validators.requiredTrue]],
    });
  }

  private selectState(): void {
    this.SignInButtonState$ = this.store.select(selectSignInButtonState);
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public getErrorMessage(control: AbstractControl): string {
    if (control === this.passwordCtrl) {
      if (control.hasError('required')) {
        return 'required';
      } else if (
        control.hasError('minlength') ||
        control.hasError('maxlength') ||
        control.hasError('pattern')
      ) {
        return 'enter a valid password';
      } else {
        return '';
      }
    } else if (control === this.usernameCtrl) {
      if (control.hasError('required')) {
        return 'required';
      } else if (
        control.hasError('minlength') ||
        control.hasError('maxlength') ||
        control.hasError('pattern')
      ) {
        return 'enter a valid username';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  public onLogin(): void {
    if (this.signInForm.valid) {
      const formValue: SignInFormValue = this.signInForm.value;
      const signInRequest: SignInRequest = {
        username: formValue.username,
        password: formValue.password,
      };
      this.store.dispatch(LogInFormActions.logInCredentialsSent({payload: signInRequest}));
    } else {
      this.signInForm.markAllAsTouched();
    }
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
