import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VpnState } from './vpn.state';

export const selectVpnState = createFeatureSelector<VpnState>('vpn');

export const selectIsDownloadingVpnConfig = createSelector(
  selectVpnState,
  (state) => state.isDownloadingConfig
);

export const selectVpnDownloadError = createSelector(
  selectVpnState,
  (state) => state.downloadError
);

export const selectLastVpnDownloadAt = createSelector(
  selectVpnState,
  (state) => state.lastDownloadedAt
);
