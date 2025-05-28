export interface VpnState {
  isDownloadingConfig: boolean;
  downloadError: string | null;
  lastDownloadedAt: Date | null;
}

export const initialVpnState: VpnState = {
  isDownloadingConfig: false,
  downloadError: null,
  lastDownloadedAt: null,
};
