import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, EMPTY } from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  tap,
  withLatestFrom,
  filter,
  exhaustMap,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { InstanceActions } from './instance.actions';
import { InstanceState } from './instance.state';
import { InstanceService } from '../../../../core/services/instance.service';
import { WebSocketService } from '../../../../core/services/websocket.service';
import { InstanceOperationStarted } from '../../../../core/models/instance-operation-started.model';
import { selectCurrentOperationId, selectUserId as selectInstanceUserId, selectIsWsConnected, selectRoomId, selectUserId } from './instance.selectors'; // Renamed to avoid conflict
import { JwtService } from '../../../../core/services/jwt.service'; // Add this import
import { LeaveRoomActions } from '../room-detail/room-detail.actions'; // Add this import


@Injectable()
export class InstanceEffects {
  private actions$ = inject(Actions);
  private instanceService = inject(InstanceService);
  private webSocketService = inject(WebSocketService);
  private store = inject(Store<InstanceState>); // Use InstanceState for the store type
  private jwtService = inject(JwtService);

  // --- HTTP Effects for Initiating Operations ---
  launchInstance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InstanceActions.launchInstance),
      // ✅ MOVED TAP HERE: Cleanup before starting the new operation
      tap((action) => { // action here is launchInstance
        console.log('🚀 Preparing for new instance launch - clearing stale state FIRST. RoomId:', action.roomId, 'UserId:', action.userId);
        localStorage.removeItem('currentOperationId');
        this.webSocketService.disconnect();
        // The reducer for launchInstance already resets the main instance state.
      }),
      exhaustMap((action) => // action is still launchInstance
        this.instanceService.createInstance(action.roomId, action.userId).pipe(
          // The original tap for logging/debugging the service call can remain or be removed if not needed.
          // tap(() => {
          //   console.log('🚀 Instance service createInstance called. Clearing stale state (if any was missed).');
          //   localStorage.removeItem('currentOperationId');
          //   this.webSocketService.disconnect();
          // }),
          map((response: InstanceOperationStarted) =>
            InstanceActions.operationAccepted({ response, roomId: action.roomId, userId: action.userId })
          ),
          catchError((error) =>
            of(InstanceActions.operationHTTPFailure({
                error: error.message || 'Failed to launch instance',
                operationType: 'CREATE',
                roomId: action.roomId
            }))
          )
        )
      )
    )
  );

  startInstance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InstanceActions.startInstance),
      exhaustMap((action) =>
        this.instanceService.startInstance(action.instanceId).pipe( // Pass only instanceId
          map((response: InstanceOperationStarted) =>
            InstanceActions.operationAccepted({ response, roomId: action.roomId, userId: action.userId })
          ),
          catchError((error) =>
            of(InstanceActions.operationHTTPFailure({
                error: error.message || 'Failed to start instance',
                operationType: 'START',
                instanceId: action.instanceId,
                roomId: action.roomId
            }))
          )
        )
      )
    )
  );

  stopInstance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InstanceActions.stopInstance),
      exhaustMap((action) =>
        this.instanceService.stopInstance(action.instanceId).pipe( // Pass only instanceId
          map((response: InstanceOperationStarted) =>
            InstanceActions.operationAccepted({ response, roomId: action.roomId, userId: action.userId })
          ),
          catchError((error) =>
            of(InstanceActions.operationHTTPFailure({
                error: error.message || 'Failed to stop instance',
                operationType: 'STOP',
                instanceId: action.instanceId,
                roomId: action.roomId
            }))
          )
        )
      )
    )
  );

  terminateInstance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InstanceActions.terminateInstance),
      exhaustMap((action) =>
        this.instanceService.terminateInstance(action.instanceId).pipe( // Pass only instanceId
          map((response: InstanceOperationStarted) =>
            InstanceActions.operationAccepted({ response, roomId: action.roomId, userId: action.userId })
          ),
          catchError((error) =>
            of(InstanceActions.operationHTTPFailure({
                error: error.message || 'Failed to terminate instance',
                operationType: 'TERMINATE',
                instanceId: action.instanceId,
                roomId: action.roomId
            }))
          )
        )
      )
    )
  );

  // --- WebSocket Connection Management Effects ---
  connectWebSocket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InstanceActions.operationAccepted),
      // Ensure there's a userId and operationId from the accepted operation
      filter(action => !!action.userId && !!action.response.operationId),
      debounceTime(100),
      tap((action) => {
        console.log('🔌 Connecting WebSocket for operation:', action.response.operationId);
        this.webSocketService.disconnect();

        // The backend topic is /user/{userId}/queue/instance-updates
        // The WebSocketService connect method needs the userId for this topic
        // and operationId to potentially filter messages if the service implements that,
        // or for the action InstanceActions.webSocketConnectionOpened.
      setTimeout(() => {
        this.webSocketService.connect(action.userId, action.response.operationId);
        this.store.dispatch(InstanceActions.connectWebSocket({ 
          userId: action.userId, 
          operationId: action.response.operationId 
        }));
      }, 100);
      })
    ),
    { dispatch: false }
  );

  // Listen to WebSocketService connection status and dispatch NgRx actions
  // This assumes WebSocketService emits events for open, close, error
  // For simplicity, we'll assume connect() in tap above is enough to trigger listening
  // and webSocketMessages$ below handles incoming messages.
  // A more robust solution would have WebSocketService emit status events.
  // For now, we'll dispatch open/close from message handling.

  disconnectWebSocket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        InstanceActions.clearInstanceState,
        InstanceActions.operationHTTPFailure,
        InstanceActions.resetInstanceState // Add this - disconnect after termination
      ),
      withLatestFrom(this.store.select(selectCurrentOperationId)),
      filter(([_action, operationId]) => !!operationId),
      tap(([_action, operationId]) => {
        if (operationId) {
          this.webSocketService.disconnect();
          this.store.dispatch(InstanceActions.webSocketConnectionClosed({ operationId }));
        }
      })
    ),
    { dispatch: false }
  );


  // --- WebSocket Message Handling Effect ---
  webSocketInstanceUpdates$ = createEffect(() =>
  this.webSocketService.messages$.pipe(
    withLatestFrom(
      this.store.select(selectCurrentOperationId),
      this.store.select(selectIsWsConnected)
    ),
    // ✅ ADD DEBUGGING
    tap(([update, currentOpIdInState, isWsConnected]) => {
      console.log('🔍 WebSocket update received:', {
        messageOpId: update.operationId,
        stateOpId: currentOpIdInState,
        messageType: update.operationType,
        messageStatus: update.status,
        isConnected: isWsConnected
      });
    }),
    filter(([update, currentOpIdInState, isWsConnected]) => {
      if (!currentOpIdInState) {
        console.warn('🚫 WS Update: No current operation ID in state. Ignoring message.', update);
        return false;
      }
      if (!update || !update.operationId) {
        console.warn('🚫 WS Update: Received invalid message structure.', update);
        return false;
      }
      if (update.operationId !== currentOpIdInState) {
        console.warn(`🚫 WS Update: Mismatched operation ID. State: ${currentOpIdInState}, Msg: ${update.operationId}. Ignoring.`, update);
        return false;
      }
      return true;
    }),
    // ✅ ADD CIRCUIT BREAKER
    distinctUntilChanged(([prevUpdate], [currUpdate]) => 
      prevUpdate.operationId === currUpdate.operationId && 
      prevUpdate.status === currUpdate.status
    ),
    map(([update, _currentOpIdInState, isWsConnected]) => {
      if (!isWsConnected) {
        this.store.dispatch(InstanceActions.webSocketConnectionOpened({ operationId: update.operationId }));
      }
      
      // ✅ Add logging before dispatch
      console.log('🎯 Dispatching action for WebSocket update:', update);
      
      if (update.operationType === 'TERMINATE') {
        if (update.status === 'TERMINATING') {
          return InstanceActions.instanceUpdateReceived({ update });
        } else if (update.status === 'TERMINATED') {
          console.log('🏁 Final TERMINATED status - resetting state');
          return InstanceActions.resetInstanceState();
        }
      }
      
      return InstanceActions.instanceUpdateReceived({ update });
    }),
    catchError(error => {
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
              error: 'User ID not available' 
            })
          );
        }

        return this.instanceService.getInstanceForRoom(action.roomId, userId.toString()).pipe(
          switchMap(instanceData => {
            const actions = [];
            // Since the backend does not return an operationId,
            // check localStorage for a persisted operationId.
            const storedOpId = localStorage.getItem('currentOperationId');
            if (storedOpId) {
              actions.push(
                InstanceActions.operationAccepted({
                  response: { operationId: storedOpId } as any,
                  roomId: action.roomId,
                  userId: userId.toString() 
                })
              );
            }
            // Always dispatch the load success action.
            actions.push(
              InstanceActions.loadInstanceDetailsSuccess({ partialState: instanceData })
            );
            return actions;
          }),
          catchError(error =>
            of(
              InstanceActions.loadInstanceDetailsFailure({
                error: error.message || 'Failed to load instance details'
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
            userId: action.userId 
          })
        ),
        // Add tap here to dispatch leave room action
        tap((operationAcceptedAction) => {
          // Dispatch leave room action immediately after termination is accepted
          this.store.dispatch(LeaveRoomActions.leaveRoom({ 
            userId: +action.userId, 
            roomId: +action.roomId 
          }));
        }),
        catchError((error) =>
          of(InstanceActions.operationHTTPFailure({
            error: error.message || 'Failed to terminate instance before leaving',
            operationType: 'TERMINATE',
            instanceId: action.instanceId,
            roomId: action.roomId
          }))
        )
      )
    )
  )
  )

    persistOperationId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InstanceActions.operationAccepted),
      tap(action => {
        localStorage.setItem('currentOperationId', action.response.operationId);
      })
    ),
    { dispatch: false }
  );

    clearOperationId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InstanceActions.resetInstanceState, InstanceActions.clearInstanceState, InstanceActions.operationHTTPFailure),
      tap(() => {
        localStorage.removeItem('currentOperationId');
      })
    ),
    { dispatch: false }
  );
}
