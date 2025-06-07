import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, EMPTY } from 'rxjs';
import { switchMap, map, catchError, tap, withLatestFrom, filter, exhaustMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { InstanceActions } from './instance.actions';
import { InstanceState } from './instance.state';
import { InstanceService } from '../../../../core/services/instance.service';
import { WebSocketService } from '../../../../core/services/websocket.service';
import { InstanceOperationStarted } from '../../../../core/models/instance-operation-started.model';
import { selectCurrentOperationId } from './instance.selectors';
import { JwtService } from '../../../../core/services/jwt.service';
import { LeaveRoomActions } from '../room-detail/room-detail.actions';

@Injectable()
export class InstanceEffects {
  private actions$ = inject(Actions);
  private instanceService = inject(InstanceService);
  private webSocketService = inject(WebSocketService);
  private store = inject(Store<InstanceState>);
  private jwtService = inject(JwtService);

  launchInstance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InstanceActions.launchInstance),
      exhaustMap((action) =>
        this.instanceService.createInstance(action.roomId, action.userId).pipe(
          map((response: InstanceOperationStarted) =>
            InstanceActions.operationAccepted({
              response,
              roomId: action.roomId,
              userId: action.userId,
            })
          ),
          catchError((error) =>
            of(
              InstanceActions.operationHTTPFailure({
                error: error.message || 'Failed to launch instance',
                operationType: 'CREATE',
                roomId: action.roomId,
              })
            )
          )
        )
      )
    )
  );

  startInstance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InstanceActions.startInstance),
      exhaustMap((action) =>
        this.instanceService.startInstance(action.instanceId).pipe(
          map((response: InstanceOperationStarted) =>
            InstanceActions.operationAccepted({
              response,
              roomId: action.roomId,
              userId: action.userId,
            })
          ),
          catchError((error) =>
            of(
              InstanceActions.operationHTTPFailure({
                error: error.message || 'Failed to start instance',
                operationType: 'START',
                instanceId: action.instanceId,
                roomId: action.roomId,
              })
            )
          )
        )
      )
    )
  );

  stopInstance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InstanceActions.stopInstance),
      exhaustMap((action) =>
        this.instanceService.stopInstance(action.instanceId).pipe(
          map((response: InstanceOperationStarted) =>
            InstanceActions.operationAccepted({
              response,
              roomId: action.roomId,
              userId: action.userId,
            })
          ),
          catchError((error) =>
            of(
              InstanceActions.operationHTTPFailure({
                error: error.message || 'Failed to stop instance',
                operationType: 'STOP',
                instanceId: action.instanceId,
                roomId: action.roomId,
              })
            )
          )
        )
      )
    )
  );

  terminateInstance$ = createEffect(() =>
      this.actions$.pipe(
        ofType(InstanceActions.terminateInstance),
        exhaustMap((action) =>
          this.instanceService.terminateInstance(action.instanceId).pipe(
            map((response: InstanceOperationStarted) =>
              InstanceActions.operationAccepted({
                response,
                roomId: action.roomId,
                userId: action.userId,
             })
            ),
            catchError((error) =>
              of(
                InstanceActions.operationHTTPFailure({
                  error: error.message || 'Failed to terminate instance',
                  operationType: 'TERMINATE',
                  instanceId: action.instanceId,
                  roomId: action.roomId,
                })
              )
            )
          )
        )
      )
  );
  // this effect only listens for the operationAccepted action and then connects to the WebSocket.
  connectWebSocket$ = createEffect(() =>
      this.actions$.pipe(
        ofType(InstanceActions.operationAccepted),
        filter((action) => !!action.userId && !!action.response.operationId), // only let pass actions that have user id and operation id
        tap((action) => {
          this.webSocketService.connect(action.userId);
          localStorage.setItem('currentOperationId',action.response.operationId);
        })
      ),
    { dispatch: false }
  );

  // we disconnect when the operation is completed or failed
  disconnectWebSocket$ = createEffect(() =>
      this.actions$.pipe(
        ofType(
          InstanceActions.clearInstanceState,
          InstanceActions.operationHTTPFailure,
          InstanceActions.instanceUpdateReceived
        ),
        withLatestFrom(this.store.select(selectCurrentOperationId)),
        filter(([action, operationId]) => {
          if (!operationId) return false;

          if (action.type === InstanceActions.instanceUpdateReceived.type) {
            const update = action.update;
            const isComplete = 
              (update.status === 'RUNNING' && ['CREATE', 'START'].includes(update.operationType)) ||
              (update.status === 'STOPPED' && update.operationType === 'STOP') ||
              (update.status === 'TERMINATED' && update.operationType === 'TERMINATE') ||
              update.status === 'FAILED'; 
            return isComplete;
          } 
         return true;
        }),
        tap(([action, operationId]) => {
            console.log('🔌 Disconnecting WebSocket for operation:', operationId);
            this.webSocketService.disconnect();
            localStorage.removeItem('currentOperationId');
        })
      ),
    { dispatch: false }
  );

  // this Effect handles incoming WebSocket messages
  webSocketInstanceUpdates$ = createEffect(() =>
    this.webSocketService.messages$.pipe(
      withLatestFrom(this.store.select(selectCurrentOperationId)),
      filter(([update, currentOpIdInState]) => { // here we only let pass updates that are related to an active operation from this client.
        if (!currentOpIdInState) {
          console.warn('🚫 WS Update: No current operation ID in state. Ignoring message.',update);
          return false;
        }
        if (!update || !update.operationId) {
          console.warn('🚫 WS Update: Received invalid message structure.',update);
          return false;
        }
        return true;
      }),
      map(([update, _currentOpIdInState]) => {
       if (update.status === 'TERMINATED') { return InstanceActions.clearInstanceState(); }
        return InstanceActions.instanceUpdateReceived({ update });
      }),
      catchError((error) => {
        console.error('❌ Error in WebSocket messages stream:', error);
        return EMPTY;
      })
    )
  );

  // --- Data Loading Effect ---
  loadInstanceDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InstanceActions.loadInstanceDetailsForRoom),
      switchMap((action) => {
        const userId = this.jwtService.getUserIdFromToken();

        if (!userId) {
          console.warn('No userId available for loading instance details');
          return of(
            InstanceActions.loadInstanceDetailsFailure({
              error: 'User ID not available',
            })
          );
        }

        return this.instanceService
          .getInstanceForRoom(action.roomId, userId.toString())
          .pipe(
            switchMap((instanceData) => {
              const actions = [];
              // Since the backend does not return an operationId,
              // check localStorage for a persisted operationId.
              const storedOpId = localStorage.getItem('currentOperationId');
              if (storedOpId) {
                actions.push(
                  InstanceActions.operationAccepted({
                    response: { operationId: storedOpId } as any,
                    roomId: action.roomId,
                    userId: userId.toString(),
                  })
                );
              }
              // Always dispatch the load success action.
              actions.push(
                InstanceActions.loadInstanceDetailsSuccess({
                  partialState: instanceData,
                })
              );
              return actions;
            }),
            catchError((error) =>
              of(
                InstanceActions.loadInstanceDetailsFailure({
                  error: error.message || 'Failed to load instance details',
                })
              )
            )
          );
      })
    )
  );

  // --- New Effects for Termination Before Leave ---
  terminateInstanceBeforeLeave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InstanceActions.terminateInstanceBeforeLeave),
      exhaustMap((action) =>
        this.instanceService.terminateInstance(action.instanceId).pipe(
          map((response: InstanceOperationStarted) =>
            InstanceActions.operationAccepted({
              response,
              roomId: action.roomId,
              userId: action.userId,
            })
          ),
          // Add tap here to dispatch leave room action
          tap((operationAcceptedAction) => {
            // Dispatch leave room action immediately after termination is accepted
            this.store.dispatch(
              LeaveRoomActions.leaveRoom({
                userId: +action.userId,
                roomId: +action.roomId,
              })
            );
          }),
          catchError((error) =>
            of(
              InstanceActions.operationHTTPFailure({
                error:
                  error.message ||
                  'Failed to terminate instance before leaving',
                operationType: 'TERMINATE',
                instanceId: action.instanceId,
                roomId: action.roomId,
              })
            )
          )
        )
      )
    )
  );
}


// A more sophisticated approach would be to modify your client-side code to establish the WebSocket connection before making the HTTP request. Your NgRx effect could first ensure the WebSocket connection is ready, then make the HTTP request, and then subscribe to the operation-specific destination using the operation ID from the response. This eliminates the race condition entirely because the subscription is guaranteed to exist before any messages are sent.