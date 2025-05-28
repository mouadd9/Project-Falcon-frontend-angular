import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { VpnActions } from './vpn.actions';
import { InstanceService } from '../../../../core/services/instance.service';

@Injectable()
export class VpnEffects {
  private actions$ = inject(Actions);
  private instanceService = inject(InstanceService);

  downloadVpnConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VpnActions.downloadConfig),
      exhaustMap((action) =>
        this.instanceService.downloadVpnConfig(action.username).pipe(
          tap((blob) => {
            // Create a download link and trigger the download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${action.username}.ovpn`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }),
          map(() => VpnActions.downloadConfigSuccess()),
          catchError((error) =>
            of(VpnActions.downloadConfigFailure({ 
              error: error.message || 'Failed to download VPN configuration' 
            }))
          )
        )
      )
    )
  );
}
