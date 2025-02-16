import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faEnvelope, faLock, faEye, faCheck, faUser } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {
  faEnvelope = faEnvelope;
  faLock = faLock;
  faEye = faEye;
  faCheck = faCheck;
  faUser = faUser;

  // we will declare the form group here
  mainForm!: FormGroup; 
  // this will be a complex form

  constructor(private fb: FormBuilder){} // this form builder will be used to create a form group 
  
  ngOnInit(): void {
    // we will create the form group when the component initialzes 
    // the form group will be binded to our DOM form , How ? 
    // ReactiveFormsModule provides us with a directive : formGroup 
    // this directive manipulates the form DOM element and binds it to a formGroup instance 
    this.initMainForm();
  }

  initMainForm(): void {
    this.mainForm = this.fb.group({});
  }




}

// end goal
  // dispatch an action from this component
  // know what model to use in order to store the form data