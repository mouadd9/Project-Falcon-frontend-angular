import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { faEnvelope, faLock, faEye, faCheck, faUser } from '@fortawesome/free-solid-svg-icons';
import { VerificationCodeRequest } from '../../../models/verification.model';
import { SignUpFormValue, SignUpRequest } from '../../../models/sign-up.model';
import { map, Observable } from 'rxjs';
import { confirmEqualValidator } from '../../../validators/confirm-equal.validator';
import { Store } from '@ngrx/store';
import { SignUpFormActions } from '../../../state/auth.actions';
import { selectVerificationCodeButtonState, selectCodeRequestError, selectSignUpButtonState } from '../../../state/auth.selectors';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent implements OnInit {
  faEnvelope = faEnvelope;
  faLock = faLock;
  faEye = faEye;
  faCheck = faCheck;
  faUser = faUser;

  mainForm!: FormGroup; // the entire form group
  loginInfoForm!: FormGroup; // login info form group
  // personalInfoForm!: FormGroup; // personal info form group

  // form controls
  emailCtrl!: FormControl;
  usernameCtrl!: FormControl;
  verificationCodeCtr!: FormControl;
  passwordCtr!: FormControl;
  confirmPasswordCtr!: FormControl;

  // observable that change the UI state

  // this observable will emit a true if the user starts typing in the password input
  // when it emits true the confirm password is shown
  showConfirmPasswordCtr$!: Observable<boolean>;

  // this observable emits true if the confirm password control is invalid (has a password confirmation error)
  showConfirmPasswordError$!: Observable<boolean>;

  SendCodebuttonState$!: Observable<any>;
  SignUpButtonState$!: Observable<any>;

  codeRequestError$!: Observable<any>;

  constructor(private fb: FormBuilder, private store: Store) { } // this form builder will be used to create a form group 

  ngOnInit(): void {
    this.selectState(); // we select state from the store
    this.initFormControls(); // we initialize form controls 
    this.initMainForm(); // we initialize form groups
    this.initObservables();
  }

  private selectState(): void {
    this.SendCodebuttonState$ = this.store.select(selectVerificationCodeButtonState);
    this.codeRequestError$ = this.store.select(selectCodeRequestError);
    this.SignUpButtonState$ = this.store.select(selectSignUpButtonState);
  }
  private initFormControls(): void {
    // verification controls
    this.emailCtrl = this.fb.control('', [
      Validators.required,
      Validators.email
    ]);
    this.verificationCodeCtr = this.fb.control('', [
      Validators.required,
      Validators.pattern('^[0-9]{6}$')
    ]);

    this.usernameCtrl = this.fb.control('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-Z0-9_-]*$')
    ]);

    // password confirmation controls
    this.passwordCtr = this.fb.control('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
    ]);

    this.confirmPasswordCtr = this.fb.control('', [Validators.required]);

    // login info form group 
    this.loginInfoForm = this.fb.group({
      username: this.usernameCtrl,
      password: this.passwordCtr,
      confirmPassword: this.confirmPasswordCtr
    }, {
      validators: [confirmEqualValidator('password', 'confirmPassword')]
    });

    // personal info form group 
    /*this.personalInfoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
    }); */

  }
  private initMainForm(): void {
    this.mainForm = this.fb.group({
      email: this.emailCtrl, // this control will be used to determin if the [send code/Sign up] button will be enabled
      verificationCode: this.verificationCodeCtr,
      loginInfo: this.loginInfoForm,
      termsAccepted: [false, [Validators.requiredTrue]]
      // personalInfo: this.personalInfoForm,
    });
  }

  private initObservables(): void {
    this.showConfirmPasswordCtr$ = this.passwordCtr.valueChanges.pipe(map(value => true)); // on value changes will return an observable, this observale emits each value the user puts in
    this.showConfirmPasswordError$ = this.loginInfoForm.statusChanges.pipe(map(status => status === 'INVALID' &&
      this.passwordCtr.value &&
      this.confirmPasswordCtr.value &&
      this.loginInfoForm.hasError('confirmEqual')));
  }

  public onSendCode() {
    if (this.emailCtrl?.valid) {
      const email = this.emailCtrl.value; 
      const verificationCodeRequest: VerificationCodeRequest = { email };
      this.store.dispatch(SignUpFormActions.verificationCodeRequestSent({ payload: verificationCodeRequest }))
    } else {
      this.emailCtrl.markAsTouched();
    }
  }
  public onSignUp() {
    if (this.mainForm.valid) {
      const formValue: SignUpFormValue = this.mainForm.value;
      const signUpRequest: SignUpRequest = {
        code: formValue.verificationCode,
        email: formValue.email,
        password: formValue.loginInfo.password,
        username: formValue.loginInfo.username
      };

      // Get requestId from localStorage
      const requestId = localStorage.getItem('verificationRequestId');
      if (requestId) {
        signUpRequest.requestId = requestId;
        this.store.dispatch(SignUpFormActions.registrationRequestSent({ payload: signUpRequest }));
      } // else we will show an error message prompting the user to send a code to his email.
    } else {
      this.markFormGroupTouched(this.mainForm);
    }
  }

  // Helper method to get error messages, we pass the control and we get its errors
  public getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength']?.requiredLength} characters`;
    }
    if (control.hasError('maxlength')) {
      return `Maximum length is ${control.errors?.['maxlength']?.requiredLength} characters`;
    }
    if (control.hasError('pattern')) {
      if (control === this.passwordCtr) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
      }
      if (control === this.verificationCodeCtr) {
        return 'Verification code must be 6 digits';
      }
      if (control === this.usernameCtrl) {
        return 'Username can only contain letters, numbers, underscores and hyphens';
      }
    }
    return '';
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}