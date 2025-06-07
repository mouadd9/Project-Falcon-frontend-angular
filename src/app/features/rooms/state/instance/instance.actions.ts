import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { InstanceOperationStarted } from '../../../../core/models/instance-operation-started.model';
import { InstanceOperationUpdate } from '../../../../core/models/instance-operation-update.model';
import { InstanceState } from './instance.state';

export const InstanceActions = createActionGroup({
  source: 'Instance',
  events: {
    // --- User-Initiated Operations (Trigger HTTP Requests) ---
    'Launch Instance': props<{ roomId: string; userId: string }>(),
    'Start Instance': props<{ instanceId: string; userId: string; roomId: string }>(), // roomId for context
    'Stop Instance': props<{ instanceId: string; userId: string; roomId: string }>(),
    'Terminate Instance': props<{ instanceId: string; userId: string; roomId: string }>(),
    'Terminate Instance Before Leave': props<{ instanceId: string; userId: string; roomId: string }>(),

    // --- HTTP Response Handling ---
    // Dispatched when the backend accepts an operation and returns an operationId
    'Operation Accepted': props<{ response: InstanceOperationStarted; roomId: string; userId: string; }>(),
    // Dispatched if the initial HTTP call to start an operation fails
    'Operation HTTP Failure': props<{ error: string; operationType: 'CREATE' | 'START' | 'STOP' | 'TERMINATE'; roomId: string; instanceId?: string; }>(),

    // --- WebSocket Message Handling ---
    // Dispatched when a new InstanceOperationUpdate is received from WebSocket
    'Instance Update Received': props<{ update: InstanceOperationUpdate }>(),

    // --- WebSocket Connection Management (handled by effects, but actions can exist) ---
    'Disconnect WebSocket': emptyProps(),
    'WebSocket Connection Closed': props<{ operationId: string; error?: any }>(),
    'WebSocket Connection Error': props<{ operationId: string; error: any }>(),


    // --- State Management & Data Loading ---
    // Loads existing instance details for a room (e.g., on room detail page load)
    'Load Instance Details For Room': props<{ roomId: string }>(),
    'Load Instance Details Success': props<{ partialState: Partial<InstanceState> }>(), // Allows merging known state
    'Load Instance Details Failure': props<{ error: string }>(),

    // Clears the instance state, typically on component destroy or when room changes
    'Clear Instance State': emptyProps(),

    // Action to explicitly set the instance state, e.g. after loading from DB
    'Set Instance State': props<{ state: InstanceState }>(),
    'Reset Instance State': emptyProps(),

  },
});
