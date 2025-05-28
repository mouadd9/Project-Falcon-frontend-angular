import { createReducer, on } from '@ngrx/store';
import { initialVpnState } from './vpn.state';
import { VpnActions } from './vpn.actions';

export const vpnReducer = createReducer(
  initialVpnState,

  // Download Config
  on(VpnActions.downloadConfig, (state) => ({
    ...state,
    isDownloadingConfig: true,
    downloadError: null,
  })),

  on(VpnActions.downloadConfigSuccess, (state) => ({
    ...state,
    isDownloadingConfig: false,
    downloadError: null,
    lastDownloadedAt: new Date(),
  })),

  on(VpnActions.downloadConfigFailure, (state, { error }) => ({
    ...state,
    isDownloadingConfig: false,
    downloadError: error,
  })),

  // Clear State
  on(VpnActions.clearState, () => ({
    ...initialVpnState,
  }))
);
