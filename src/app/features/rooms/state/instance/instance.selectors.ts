import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InstanceState } from './instance.state';

export const selectInstanceState = createFeatureSelector<InstanceState>('instance');

// --- Basic State Properties ---
export const selectInstanceId = createSelector(selectInstanceState, (state) => state.instanceId);
export const selectRoomId = createSelector(selectInstanceState, (state) => state.roomId);
export const selectUserId = createSelector(selectInstanceState, (state) => state.userId);
export const selectCurrentOperationId = createSelector(selectInstanceState, (state) => state.currentOperationId);
export const selectCurrentOperationType = createSelector(selectInstanceState, (state) => state.currentOperationType);
export const selectLifecycleStatus = createSelector(selectInstanceState, (state) => state.lifecycleStatus);
export const selectIsHttpLoading = createSelector(selectInstanceState, (state) => state.isHttpLoading);
export const selectInstanceProgress = createSelector(selectInstanceState, (state) => state.progress);
export const selectInstanceMessage = createSelector(selectInstanceState, (state) => state.message);
export const selectInstanceIpAddress = createSelector(selectInstanceState, (state) => state.ipAddress);
export const selectInstanceError = createSelector(selectInstanceState, (state) => state.error);


// --- Derived Selectors for UI Logic ---

// Determines if any operation is currently in a pending HTTP or WebSocket
export const selectIsOperationInProgress = createSelector(
  selectIsHttpLoading,
  selectCurrentOperationId, // If an operationId is set, WS updates are expected
  selectLifecycleStatus,
  (httpLoading, opId, status) =>
    httpLoading ||
    (!!opId && // if there's an operation ID, it means we are waiting for WS messages
    (status === 'CREATING' ||
      status === 'STARTING' ||
      status === 'STOPPING' ||
      status === 'TERMINATING'))
);

// Information to display in the "grey box" under buttons
export const selectInstanceDisplayInfo = createSelector(
  selectLifecycleStatus,
  selectInstanceMessage,
  selectInstanceProgress,
  selectInstanceIpAddress,
  selectInstanceError,
  selectIsOperationInProgress,
  (status, message, progress, ip, error, isOpInProgress) => {
    // Show info for NOT_STARTED state
    if (status === 'NOT_STARTED') {
      return {
        status,
        message: message || 'No instance created yet. Click Launch to get started.',
        progress: 0,
        ipAddress: null,
        isError: false,
        showProgress: false,
      };
    }
      if (!isOpInProgress && status !== 'RUNNING' && status !== 'STOPPED' && status !== 'PAUSED' && status !== 'FAILED') {
        // If no operation is active and not in a stable post-op state, show nothing or a default message
        if (status === 'NON_EXISTENT' || status === 'TERMINATED' || status === 'UNKNOWN') {
            return {
              status,
              message: 'No active instance. Click Launch to create one.',
              progress: 0,
              ipAddress: null,
              isError: false,
              showProgress: false,
            };
        }
    }    return {
      status, // Frontend lifecycle status
      message: error || message || 'Awaiting update...',
      progress: progress,
      // Hide IP address for PAUSED instances since they get new IP on resume
      ipAddress: status === 'PAUSED' ? null : ip,
      isError: !!error || status === 'FAILED',
      showProgress: status === 'CREATING' || status === 'STARTING' || status === 'STOPPING' || status === 'TERMINATING',
    };
  }
);

// Primary Dynamic Button - Single button that changes based on state
export const selectPrimaryActionButton = createSelector(
  selectLifecycleStatus,
  selectIsHttpLoading,
  selectCurrentOperationType,
  (status, isLoading, opType): { text: string; disabled: boolean; variant: 'launch' | 'start' | 'launching' | 'starting' } => {
    
    // Lauching 
    if (isLoading && opType === 'CREATE') return { text: 'Launching...', disabled: true, variant: 'launching' };
    if (status === 'CREATING') return { text: 'Launching...', disabled: true, variant: 'launching' };

    // Starting
    if (isLoading && opType === 'START') return { text: 'Starting...', disabled: true, variant: 'starting' };
    if (status === 'STARTING') return { text: 'Starting...', disabled: true, variant: 'starting' };
     
    // Ready to start from stopped/paused state
    if (status === 'STOPPED' || status === 'PAUSED') return { text: 'Resume', disabled: false, variant: 'start' };
    
    // Ready to launch (initial state or after termination)
    if (status === 'NON_EXISTENT' || status === 'NOT_STARTED' || status === 'TERMINATED' || status === 'UNKNOWN' || status === 'FAILED') {
      return { text: 'Launch', disabled: false, variant: 'launch' };
    }
    
    // Instance is running - no primary action needed
    if (status === 'RUNNING') return { text: 'Running', disabled: true, variant: 'start' };
    
    // Default fallback
    return { text: 'Launch', disabled: true, variant: 'launch' };
  }
);

// Small Action Buttons - Only appear when relevant
export const selectSmallActionButtons = createSelector(
  selectLifecycleStatus,
  selectIsHttpLoading,
  selectCurrentOperationType,
  (status, isLoading, opType): { pause?: { text: string; disabled: boolean }; terminate?: { text: string; disabled: boolean } } => {
    const result: { pause?: { text: string; disabled: boolean }; terminate?: { text: string; disabled: boolean } } = {};
    
    // Pause button (stop) - only when running
    if (status === 'RUNNING') {
      const isPausing = (isLoading && opType === 'STOP') || false;
      result.pause = {
        text: isPausing ? 'Pausing...' : 'Pause',
        disabled: isPausing
      };
    }
    
    // Check for stopping status separately
    if (status === 'STOPPING') {
      result.pause = {
        text: 'Pausing...',
        disabled: true
      };
    }
    
    // Terminate button - when running, stopped, paused, or failed
    if (status === 'RUNNING' || status === 'STOPPED' || status === 'PAUSED' || status === 'FAILED') {
      const isTerminating = (isLoading && opType === 'TERMINATE') || false;
      result.terminate = {
        text: isTerminating ? 'Terminating...' : 'Terminate',
        disabled: isTerminating
      };
    }
    
    // Check for terminating status separately
    if (status === 'TERMINATING') {
      result.terminate = {
        text: 'Terminating...',
        disabled: true
      };
    }
    
    return result;
  }
);

// Progress Bar - Shows mini progress bar during operations
export const selectProgressBar = createSelector(
  selectLifecycleStatus,
  selectInstanceProgress,
  (status, progress): 
  { show: boolean;
    progress: number;
    variant: string 
  } => {
    const isOperationActive = status === 'CREATING' || status === 'STARTING' || status === 'STOPPING' || status === 'TERMINATING';
    
    if (!isOperationActive) {
      return { show: false, progress: 0, variant: 'default' };
    }
    
    let variant = 'default';
    switch (status) {
      case 'CREATING':
        variant = 'creating';
        break;
      case 'STARTING':
        variant = 'starting';
        break;
      case 'STOPPING':
        variant = 'stopping';
        break;
      case 'TERMINATING':
        variant = 'terminating';
        break;
    }
    
    return {
      show: true,
      progress: progress || 0,
      variant
    };
  }
);

// Add this new selector
export const selectShouldBlockLeaving = createSelector(
  selectLifecycleStatus,
  selectIsHttpLoading,
  selectCurrentOperationType,
  (status, isHttpLoading, operationType): boolean => {
    // Block leaving during active operations
    const blockingStatuses = ['CREATING', 'STARTING', 'STOPPING', 'TERMINATING'];
    const blockingOperations = ['CREATE', 'START', 'STOP', 'TERMINATE'];
    
    // Block if in a transitional state
    if (blockingStatuses.includes(status)) {
      return true;
    }
    
    // Block if HTTP loading for critical operations
    if (isHttpLoading && operationType && blockingOperations.includes(operationType)) {
      return true;
    }
    
    return false;
  }
);