
/**
 * Represents the lifecycle and operational state of a virtual machine instance
 * associated with a room.
 */
export interface InstanceState {
  // Identifiers
  instanceId: string | null;      // Local database ID of the instance. Persists across operations.
  roomId: string | null;          // Room associated with this instance.
  userId: string | null;          // User who owns/initiated operations on this instance.

  // Current Operation Tracking (for ongoing async backend processes)
  currentOperationId: string | null; // ID of the active backend operation (from InstanceOperationStarted).
  currentOperationType: 'CREATE' | 'START' | 'STOP' | 'TERMINATE' | null | string; // Type of the active backend operation.

  // Instance Lifecycle Status (reflects the actual state of the VM)
  lifecycleStatus: string  // Represents the "physical" state of the instance
    | 'UNKNOWN'       // Initial state or after clear, before any info is loaded/operation starts
    | 'NON_EXISTENT'  // No instance DB record exists for this room (or it was terminated and cleared)
    | 'CREATING'      // Create operation is in progress.
    | 'STARTING'      // Start operation is in progress.
    | 'RUNNING'       // Instance is provisioned and active.
    | 'STOPPING'      // Stop operation is in progress.
    | 'STOPPED'       // Instance is provisioned but not running (paused/saved state).
    | 'TERMINATING'   // Terminate operation is in progress.
    | 'TERMINATED'    // Instance has been destroyed.
    | 'FAILED';       // The last operation attempt resulted in an unrecoverable error.

  // UI Interaction and Feedback
  isHttpLoading: boolean;         // True if an HTTP request to initiate an operation is in flight.
  progress: number;               // Overall progress of the current operation (0-100).
  message: string | null;         // User-facing message related to the current operation or state.
  ipAddress: string | null;       // IP address of the running instance.
  error: string | null;           // Error message if the last operation failed.
}

export const initialInstanceState: InstanceState = {
  instanceId: null,
  roomId: null,
  userId: null,
  currentOperationId: null,
  currentOperationType: null,
  lifecycleStatus: 'UNKNOWN',
  isHttpLoading: false,
  progress: 0,
  message: null,
  ipAddress: null,
  error: null,
};