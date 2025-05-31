import { Component, OnInit } from '@angular/core';
import { faMedal, faDoorOpen, faServer, faFire } from '@fortawesome/free-solid-svg-icons';
import { JwtService } from '../../../../../core/services/jwt.service';

@Component({
  selector: 'app-profile-banner',
  standalone: false,
  templateUrl: './profile-banner.component.html',
  styleUrl: './profile-banner.component.scss'
})
export class ProfileBannerComponent implements OnInit {
  // Font Awesome icons
  faMedal = faMedal;
  faDoorOpen = faDoorOpen;
  faServer = faServer;
  faFire = faFire;

  username: string = '';

  constructor(private jwtService: JwtService) {}   

  ngOnInit(): void {
    this.initializeUserData();
  }

   private initializeUserData(): void {
    const token = localStorage.getItem('access-token');
    if (token) {
      const decoded = this.jwtService.decodeToken(token);
      this.username = decoded.sub;
    }
  }
}
