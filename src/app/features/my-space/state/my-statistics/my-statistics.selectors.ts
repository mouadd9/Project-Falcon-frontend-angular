import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MyProfileStatisticsState } from './my-statistics.state';


export const selectMyProfileStatisticsState = createFeatureSelector<MyProfileStatisticsState>('myProfileStatistics');

export const selectProfileStatisticsData = createSelector(
  selectMyProfileStatisticsState,
  (state: MyProfileStatisticsState) => state.profileStatistics
);

export const selectProfileStatisticsLoading = createSelector(
  selectMyProfileStatisticsState,
  (state: MyProfileStatisticsState) => state.loading
);

export const selectProfileStatisticsError = createSelector(
  selectMyProfileStatisticsState,
  (state: MyProfileStatisticsState) => state.error
);