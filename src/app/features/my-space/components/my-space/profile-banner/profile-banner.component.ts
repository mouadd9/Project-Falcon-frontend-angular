import { Component, OnInit } from '@angular/core';
import { faMedal, faDoorOpen, faServer, faFire } from '@fortawesome/free-solid-svg-icons';
import { JwtService } from '../../../../../core/services/jwt.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as MyStatisticsActions from '../../../state/my-statistics/my-statistics.actions';
import * as MyStatisticsSelectors from '../../../state/my-statistics/my-statistics.selectors';
import { MyProfileStatisticsState } from '../../../state/my-statistics/my-statistics.state'; // Import the state interface

@Component({
  selector: 'app-profile-banner',
  standalone: false,
  templateUrl: './profile-banner.component.html',
  styleUrls: ['./profile-banner.component.scss']
})
export class ProfileBannerComponent implements OnInit {
  // Font Awesome icons
  faMedal = faMedal;
  faDoorOpen = faDoorOpen;
  faServer = faServer;
  faFire = faFire;

  username: string = '';

  // Single observable for the entire profile statistics state
  profileStatisticsState$: Observable<MyProfileStatisticsState>;

  constructor(
    private jwtService: JwtService,
    private store: Store
  ) {
    // Select the entire feature state
    this.profileStatisticsState$ = this.store.select(MyStatisticsSelectors.selectMyProfileStatisticsState);
  }   

  ngOnInit(): void {
    this.initializeUserData();
    this.store.dispatch(MyStatisticsActions.loadProfileStatistics());
  }

   private initializeUserData(): void {
    const token = localStorage.getItem('access-token');
    if (token) {
      const decoded = this.jwtService.decodeToken(token);
      this.username = decoded.sub;
    }
  }
}
