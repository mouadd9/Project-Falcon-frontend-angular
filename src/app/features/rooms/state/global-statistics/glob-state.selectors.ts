import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GlobalStatisticsState } from './glob-stats.state';


export const selectGlobalStatisticsState = createFeatureSelector<GlobalStatisticsState>('globalStatistics');

export const selectGlobalStatisticsData = createSelector(
  selectGlobalStatisticsState,
  (state: GlobalStatisticsState) => state.globalStatistics
);

export const selectGlobalStatisticsLoading = createSelector(
  selectGlobalStatisticsState,
  (state: GlobalStatisticsState) => state.loading
);

export const selectGlobalStatisticsError = createSelector(
  selectGlobalStatisticsState,
  (state: GlobalStatisticsState) => state.error
);