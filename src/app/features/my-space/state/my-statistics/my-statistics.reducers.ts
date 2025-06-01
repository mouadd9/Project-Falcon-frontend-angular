import { createReducer, on } from '@ngrx/store';
import * as MyStatisticsActions from './my-statistics.actions';
import { initialMyProfileStatisticsState, MyProfileStatisticsState } from './my-statistics.state';

export const myProfileStatisticsReducer = createReducer(
  initialMyProfileStatisticsState,
  on(MyStatisticsActions.loadProfileStatistics, (state): MyProfileStatisticsState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MyStatisticsActions.loadProfileStatisticsSuccess, (state, { statistics }): MyProfileStatisticsState => ({
    ...state,
    profileStatistics: statistics,
    loading: false,
    error: null,
  })),
  on(MyStatisticsActions.loadProfileStatisticsFailure, (state, { error }): MyProfileStatisticsState => ({
    ...state,
    profileStatistics: null,
    loading: false,
    error,
  }))
);