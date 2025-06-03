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
    lastStatusUpdateAt: new Date(),
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
    currentPhase: 'Requesting Start',
    lastStatusUpdateAt: new Date(),
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
    currentPhase: 'Requesting Stop',
    lastStatusUpdateAt: new Date(),
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
    currentPhase: 'Requesting Termination',
    lastStatusUpdateAt: new Date(),
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
    currentPhase: 'Requesting Termination',
    lastStatusUpdateAt: new Date(),
  })),

  // --- HTTP Response Handling ---
  on(InstanceActions.operationAccepted, (state, { response, roomId, userId }) => {
    // Ensure this operation acceptance matches the one we just initiated
    if (state.currentOperationType !== response.operationType) {
        console.warn("Received operationAccepted for a different operationType than expected. Current:", state.currentOperationType, "Received:", response.operationType);
        // Potentially reset or handle as an error, or just ignore if strict matching is desired.
        // For now, we'll proceed, assuming the latest action takes precedence or context is clear.
    }
    return {
        ...state,
        isHttpLoading: false,
        currentOperationId: response.operationId,
        // instanceId might be null from response for CREATE, use existing or wait for WS update
        instanceId: response.instanceId || state.instanceId,
        userId: userId, // ensure userId is set from the action context
        roomId: roomId, // ensure roomId is set
        // lifecycleStatus and progress will be updated by subsequent WebSocket messages.
        // Message can be updated from response.message
        message: response.message || state.message,
        error: null, // Clear previous errors
        lastStatusUpdateAt: new Date(),
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
      currentPhase: 'HTTP Error',
      progress: 0,
      currentOperationId: null, // No operation to track via WebSocket
      lastStatusUpdateAt: new Date(),
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
      currentPhase: update.phase || state.currentPhase,
      message: update.message || state.message,
      error: update.status === 'FAILED' ? update.error || 'Operation failed via WebSocket.' : null,
      lastStatusUpdateAt: new Date(),
      // If operation is terminally completed (RUNNING for CREATE/START, STOPPED, TERMINATED, FAILED),
      // we might clear currentOperationId and currentOperationType here, or in an effect.
      // For now, let's keep them until a new operation starts or state is cleared.
      // isWsConnected will be managed by connection status actions.
    };
  }),

  // --- WebSocket Connection Status ---
  on(InstanceActions.webSocketConnectionOpened, (state, { operationId }) => {
    if (state.currentOperationId !== operationId) return state;
    return { ...state, isWsConnected: true, message: state.message || 'Connected for real-time updates.' };
  }),

  on(InstanceActions.webSocketConnectionClosed, (state, { operationId, error }) => {
    if (state.currentOperationId !== operationId) return state;
    return {
      ...state,
      isWsConnected: false,
      message: error ? 'WebSocket disconnected with error.' : 'WebSocket disconnected.',
      error: error ? state.error || JSON.stringify(error) : state.error,
    };
  }),
  on(InstanceActions.webSocketConnectionError, (state, { operationId, error }) => {
    if (state.currentOperationId !== operationId) return state;
    return {
      ...state,
      isWsConnected: false,
      lifecycleStatus: 'FAILED', // Assume failure if WS connection itself errors out during an operation
      error: JSON.stringify(error),
      message: 'WebSocket connection error.',
    };
  }),


  // --- State Management & Data Loading ---
  on(InstanceActions.loadInstanceDetailsForRoom, (state, { roomId }) => ({
    ...initialInstanceState, // Reset for loading, or merge if preferred
    roomId,
    isHttpLoading: true, // Indicates loading instance data
    message: 'Loading instance details...',
    lastStatusUpdateAt: new Date(),
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
      message,
      lastStatusUpdateAt: new Date(),
    };
  }),

  on(InstanceActions.loadInstanceDetailsFailure, (state, { error }) => ({
    ...state,
    isHttpLoading: false,
    lifecycleStatus: 'FAILED', // Or 'UNKNOWN'
    error,
    message: 'Failed to load instance details.',
    lastStatusUpdateAt: new Date(),
  })),

  on(InstanceActions.clearInstanceState, () => ({
    ...initialInstanceState,
    lastStatusUpdateAt: new Date(), // record when it was cleared
  })),

  on(InstanceActions.setInstanceState, (_state, { state: newState }) => ({
    ...newState,
    lastStatusUpdateAt: new Date(),
  })),

  on(InstanceActions.resetInstanceState, () => ({
    ...initialInstanceState
  })),
);