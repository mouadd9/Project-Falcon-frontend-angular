import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { faEnvelope, faLock, faEye, faCheck, faUser } from '@fortawesome/free-solid-svg-icons';
import { VerificationCodeRequest } from '../../../models/verification.model';
import { SignUpFormValue, SignUpRequest } from '../../../models/sign-up.model';
import { map, Observable } from 'rxjs';
import { confirmEqualValidator } from '../../../validators/confirm-equal.validator';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  faEnvelope = faEnvelope;
  faLock = faLock;
  faEye = faEye;
  faCheck = faCheck;
  faUser = faUser;

  mainForm!: FormGroup; // the entire form group

  personalInfoForm!: FormGroup; // personal info form group
  loginInfoForm!: FormGroup; // login info form group

  // form controls
  emailCtr!: FormControl;
  usernameCtrl!: FormControl;
  verificationCodeCtr!: FormControl;
  passwordCtr!: FormControl;
  confirmPasswordCtr!: FormControl;

  showConfirmPasswordCtr$!: Observable<boolean>; // if password input is touched the show Confirm Password Observable will emit a true value, this true value will show the confirm password input
  showConfirmPasswordError$!: Observable<boolean>;

  constructor(private fb: FormBuilder) { } // this form builder will be used to create a form group 

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    this.initObservables();
  }

  private initObservables(): void {
    // the idea here is, when the password form control is dirty the confirm password will be shown 
    this.showConfirmPasswordCtr$ = this.passwordCtr.valueChanges.pipe(map(value => true)); // on value changes will return an observable, this observale emits each value the user puts in
    this.showConfirmPasswordError$ = this.loginInfoForm.statusChanges.pipe(map(status=>status === 'INVALID' &&
      this.passwordCtr.value &&
      this.confirmPasswordCtr.value &&
      this.loginInfoForm.hasError('confirmEqual')));

  }

  private initMainForm(): void {
    this.mainForm = this.fb.group({
      email: this.emailCtr, // this control will be used to determin if the [send code/Sign up] button will be enabled
      verificationCode: this.verificationCodeCtr,
      personalInfo: this.personalInfoForm,
      loginInfo: this.loginInfoForm,
      termsAccepted: [false, [Validators.requiredTrue]]
    });
  }

  private initFormControls(): void {
    // verification controls
    this.emailCtr = this.fb.control('', [
      Validators.required,
      Validators.email
    ]);
    this.verificationCodeCtr = this.fb.control('', [
      Validators.required,
      Validators.pattern('^[0-9]{6}$')
    ]);

    // personal info form group 
    this.personalInfoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
    });

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
  }

  onSendCode() {
    if (this.emailCtr?.valid) {
      const verificationCodeRequest: VerificationCodeRequest = this.emailCtr.value;
      console.log(verificationCodeRequest);
      //  Dispatch action with `verificationCodeRequest`
    } else {
      console.log("email control is invalid");
    }
  }

  onSignUp() {
    if (this.mainForm.valid) {
      const formValue: SignUpFormValue = this.mainForm.value;
      const signUpRequest: SignUpRequest = {
        email: formValue.email,
        verificationCode: formValue.verificationCode,
        personalInfo: formValue.personalInfo,
        loginInfo: formValue.loginInfo,
        requestId: '4545'
      };
      console.log('Sign up request:', signUpRequest);
      // Dispatch sign up action
    } else {
      this.markFormGroupTouched(this.mainForm);
    }
  }

  // Helper method to get error messages
  getErrorMessage(control: AbstractControl): string {
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