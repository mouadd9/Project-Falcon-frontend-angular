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
  exhaustMap
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
      exhaustMap((action) =>
        this.instanceService.createInstance(action.roomId, action.userId).pipe(
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
      tap((action) => {
        // The backend topic is /user/{userId}/queue/instance-updates
        // The WebSocketService connect method needs the userId for this topic
        // and operationId to potentially filter messages if the service implements that,
        // or for the action InstanceActions.webSocketConnectionOpened.
        this.webSocketService.connect(action.userId, action.response.operationId);
        // Dispatch an action indicating connection attempt
        this.store.dispatch(InstanceActions.connectWebSocket({ userId: action.userId, operationId: action.response.operationId }));
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
      this.store.select(selectIsWsConnected) // Add this to withLatestFrom
    ),
    // Filter messages: only process if there's a currentOperationId in state
    // and the message's operationId matches it.
    filter(([update, currentOpIdInState, isWsConnected]) => {
      if (!currentOpIdInState) {
        console.warn('WS Update: No current operation ID in state. Ignoring message.', update);
        return false;
      }
      if (!update || !update.operationId) {
        console.warn('WS Update: Received invalid message structure.', update);
        return false;
      }
      if (update.operationId !== currentOpIdInState) {
        console.warn(`WS Update: Mismatched operation ID. State: ${currentOpIdInState}, Msg: ${update.operationId}. Ignoring.`, update);
        return false;
      }
      return true;
    }),
    map(([update, _currentOpIdInState, isWsConnected]) => {
      // Mark WebSocket as connected if this is the first message
      if (!isWsConnected) {
        this.store.dispatch(InstanceActions.webSocketConnectionOpened({ operationId: update.operationId }));
      }
      
      // Handle termination - reset instance state
      if (update.operationType === 'TERMINATE' && update.status === 'TERMINATED') {
        return InstanceActions.resetInstanceState();
      }
      
      return InstanceActions.instanceUpdateReceived({ update });
    }),
    catchError(error => {
      console.error('Error in WebSocket messages stream:', error);
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
          return of(InstanceActions.loadInstanceDetailsFailure({ 
            error: 'User ID not available' 
          }));
        }
        
        return this.instanceService.getInstanceForRoom(action.roomId, userId.toString()).pipe(
          map(instanceData => InstanceActions.loadInstanceDetailsSuccess({ partialState: instanceData })),
          catchError(error => of(InstanceActions.loadInstanceDetailsFailure({ 
            error: error.message || 'Failed to load instance details' 
          })))
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
}
