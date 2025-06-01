import { createReducer, on } from '@ngrx/store';
import * as GlobalStatsActions from './glob-stats.actions';
import { initialGlobalStatisticsState, GlobalStatisticsState } from './glob-stats.state';

export const globalStatisticsReducer = createReducer(
  initialGlobalStatisticsState,
  on(GlobalStatsActions.loadGlobalStatistics, (state): GlobalStatisticsState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(GlobalStatsActions.loadGlobalStatisticsSuccess, (state, { statistics }): GlobalStatisticsState => ({
    ...state,
    globalStatistics: statistics,
    loading: false,
    error: null,
  })),
  on(GlobalStatsActions.loadGlobalStatisticsFailure, (state, { error }): GlobalStatisticsState => ({
    ...state,
    globalStatistics: null,
    loading: false,
    error,
  }))
);