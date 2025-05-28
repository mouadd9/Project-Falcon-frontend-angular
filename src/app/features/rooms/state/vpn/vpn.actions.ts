import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const VpnActions = createActionGroup({
  source: 'VPN',
  events: {
    // VPN Config Download
    'Download Config': props<{ username: string }>(),
    'Download Config Success': emptyProps(),
    'Download Config Failure': props<{ error: string }>(),
    
    // Clear VPN State
    'Clear State': emptyProps(),
  }
});
