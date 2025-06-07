import { createReducer, on } from '@ngrx/store';
import { initialInstanceState, InstanceState } from './instance.state';
import { InstanceActions } from './instance.actions';
import { BackendOperationStatus } from '../../../../core/models/instance-operation-update.model';

// Helper to map backend status and operation type to frontend lifecycle status
function mapBackendToFrontendStatus(backendStatus: BackendOperationStatus | string, operationType: 'CREATE' | 'START' | 'STOP' | 'TERMINATE'): InstanceState['lifecycleStatus'] {
  switch (backendStatus) {
    case 'INITIALIZING':
    case 'REQUESTING':
      return operationType === 'CREATE' ? 'CREATING' : 'STARTING'; // Or based on opType
    case 'PROVISIONING':
      return 'CREATING';
    case 'STARTING':
      return 'STARTING';
    case 'RUNNING':
      return 'RUNNING';
    case 'STOPPING':
      return 'STOPPING';
    case 'STOPPED':
      return 'STOPPED';
    case 'TERMINATING':
      return 'TERMINATING';
    case 'TERMINATED':
      return 'TERMINATED';
    case 'FAILED':
      return 'FAILED';
    // 'STARTED' might be a final status from backend for a start op.
    // If backend sends 'RUNNING' as final for start, this case might not be needed.
    case 'STARTED':
      return 'RUNNING';
    default:
      console.warn(`Unknown backend status mapping: ${backendStatus} for ${operationType}`);
      return 'UNKNOWN'; // Or handle as an error/specific failed state
  }
}

export const instanceReducer = createReducer(
  initialInstanceState,

  // --- User-Initiated Operations ---
  on(InstanceActions.launchInstance, (state, { roomId, userId }) => ({
    ...initialInstanceState, // Reset state for a new operation
    roomId,
    userId,
    currentOperationType: 'CREATE',
    lifecycleStatus: 'CREATING', // Tentative status
    isHttpLoading: true,
    message: 'Initiating instance launch...',
  })),

  on(InstanceActions.startInstance, (state, { instanceId, userId, roomId }) => ({
    ...state,
    instanceId, // Should already exist
    userId,
    roomId,
    currentOperationId: null, // Clear previous operation ID before new one is accepted
    currentOperationType: 'START',
    lifecycleStatus: 'STARTING', // Tentative status
    isHttpLoading: true,
    progress: 0,
    error: null,
    message: 'Initiating instance start...',
  })),

  on(InstanceActions.stopInstance, (state, { instanceId, userId, roomId }) => ({
    ...state,
    instanceId,
    userId,
    roomId,
    currentOperationId: null,
    currentOperationType: 'STOP',
    lifecycleStatus: 'STOPPING', // Tentative status
    isHttpLoading: true,
    progress: 0,
    error: null,
    message: 'Initiating instance stop...',
  })),

  on(InstanceActions.terminateInstance, (state, { instanceId, userId, roomId }) => ({
    ...state,
    instanceId,
    userId,
    roomId,
    currentOperationType: 'TERMINATE',
    lifecycleStatus: 'TERMINATING',
    isHttpLoading: true,
    progress: 0,
    error: null,
    message: 'Initiating instance termination...',
  })),

  // Add this reducer handler after the terminateInstance handler
  on(InstanceActions.terminateInstanceBeforeLeave, (state, { instanceId, userId, roomId }) => ({
    ...state,
    instanceId,
    userId,
    roomId,
    currentOperationId: null,
    currentOperationType: 'TERMINATE',
    lifecycleStatus: 'TERMINATING',
    isHttpLoading: true,
    progress: 0,
    error: null,
    message: 'Terminating instance before leaving room...',
  })),

  // --- HTTP Response Handling ---
  on(InstanceActions.operationAccepted, (state, { response, roomId, userId }) => {
    return {
        ...state,
        isHttpLoading: false,
        currentOperationId: response.operationId, // we set this i nour state.
        instanceId: response.instanceId || state.instanceId, // Update instanceId if provided by backend
        userId: userId, // ensure userId is set from the action context
        roomId: roomId, // ensure roomId is set
        error: null, // Clear previous errors
    };
  }),

  on(InstanceActions.operationHTTPFailure, (state, { error, operationType, roomId, instanceId }) => {
    // Only update if the failure matches the current operation type being attempted
    if (state.currentOperationType !== operationType) {
      return state; // Or handle as a stale error
    }
    return {
      ...state,
      isHttpLoading: false,
      lifecycleStatus: 'FAILED',
      error: error,
      message: `Failed to initiate ${operationType.toLowerCase()} operation.`,
      progress: 0,
      currentOperationId: null, // No operation to track via WebSocket
    };
  }),

  // --- WebSocket Message Handling ---
  on(InstanceActions.instanceUpdateReceived, (state, { update }) => {
    
    console.log('WebSocket update received:');
    console.log(update);

    if (state.currentOperationId !== update.operationId) {
      console.warn('Stale WebSocket update received for a different operationId.');
      return state; // Ignore updates not matching the current tracked operation
    }

    const newLifecycleStatus = mapBackendToFrontendStatus(update.status, update.operationType);

    return {
      ...state,
      instanceId: update.instanceId || state.instanceId, // Update if backend provides it
      lifecycleStatus: newLifecycleStatus,
      progress: update.progress,
      ipAddress: update.ipAddress || state.ipAddress, // Persist IP if already known
      message: update.message || state.message,
      error: update.status === 'FAILED' ? update.error || 'Operation failed via WebSocket.' : null,
    };
  }),

  // --- State Management & Data Loading ---
  on(InstanceActions.loadInstanceDetailsForRoom, (state, { roomId }) => ({
    ...initialInstanceState, // Reset for loading, or merge if preferred
    roomId,
    isHttpLoading: true, // Indicates loading instance data
    message: 'Loading instance details...',
  })),

  on(InstanceActions.loadInstanceDetailsSuccess, (state, { partialState }) => {
    const lifecycleStatus = partialState.lifecycleStatus || (partialState.instanceId ? 'UNKNOWN' : 'NOT_STARTED');
    
    let message: string;
    if (lifecycleStatus === 'NOT_STARTED') {
      message = 'No active instance for this room. Click Launch to create one.';
    } else {
      message = partialState.message || (partialState.instanceId ? 'Instance details loaded.' : 'No active instance for this room. Click Launch to create one.');
    }
    
    return {
      ...state,
      ...partialState, // Merge the loaded data
      isHttpLoading: false,
      error: null,
      lifecycleStatus,
      message
    };
  }),

  on(InstanceActions.loadInstanceDetailsFailure, (state, { error }) => ({
    ...state,
    isHttpLoading: false,
    lifecycleStatus: 'FAILED', // Or 'UNKNOWN'
    error,
    message: 'Failed to load instance details.',
  })),

  on(InstanceActions.clearInstanceState, () => ({
    ...initialInstanceState,
  }))
);