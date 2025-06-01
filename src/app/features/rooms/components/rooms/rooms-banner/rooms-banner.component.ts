import { Component, OnInit } from '@angular/core';
import { faCube, faDoorOpen, faFire, faLeaf } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GlobalStatisticsState } from '../../../state/global-statistics/glob-stats.state'; 
import * as GlobalStatisticsActions from '../../../state/global-statistics/glob-stats.actions';
import * as GlobalStatisticsSelectors from '../../../state/global-statistics/glob-state.selectors';

@Component({
  selector: 'app-rooms-banner',
  standalone: false,
  templateUrl: './rooms-banner.component.html',
  styleUrls: ['./rooms-banner.component.scss'] // Corrected from styleUrl
})
export class RoomsBannerComponent implements OnInit {
  faDoorOpen = faDoorOpen;
  faLeaf = faLeaf;
  faCube = faCube;
  faFire = faFire;  

  globalStatisticsState$: Observable<GlobalStatisticsState>;

  constructor(private store: Store) {
    this.globalStatisticsState$ = this.store.select(GlobalStatisticsSelectors.selectGlobalStatisticsState);
  }

  ngOnInit(): void {
    this.store.dispatch(GlobalStatisticsActions.loadGlobalStatistics());
  }

  getProgressWidth(completed: number | undefined, total: number | undefined): string {
    if (total === undefined || total === 0 || completed === undefined) {
      return '0%';
    }
    const percentage = (completed / total) * 100;
    return `${Math.min(Math.max(percentage, 0), 100)}%`; // Ensure between 0 and 100
  }
}
