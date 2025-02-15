import { Component } from '@angular/core';
import { faEnvelope, faLock, faEye, faCheck } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  faEnvelope = faEnvelope;
  faLock = faLock;
  faEye = faEye;
  faCheck = faCheck;

}
