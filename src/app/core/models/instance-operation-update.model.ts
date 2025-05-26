/**
 * Represents a real-time progress update for an instance operation, received via WebSocket.
 */
export interface InstanceOperationUpdate {
  operationId: string;
  instanceId: string; // Local database ID of the instance
  status: BackendOperationStatus | string; // Raw status from backend (e.g., "PROVISIONING", "RUNNING")
  message: string;
  progress: number; // 0-100
  timestamp: string; // ISO date string
  error?: string;
  operationType: 'CREATE' | 'START' | 'STOP' | 'TERMINATE'; // Crucial for interpreting the status
  phase?: string; // Human-readable phase (e.g., "Database Setup", "Cloud Request")
  ipAddress?: string;
  // cloudInstanceId is NOT expected from the backend as per our last discussion
}

/**
 * Matches the backend enum `InstanceOperationUpdate.OperationStatus`.
 */
export type BackendOperationStatus =
  | 'INITIALIZING'
  | 'REQUESTING'
  | 'PROVISIONING'
  | 'RUNNING'
  | 'STOPPING'
  | 'STOPPED'
  | 'TERMINATING'
  | 'FAILED'
  | 'STARTED' // This might be a "final" state for a start operation if distinct from RUNNING
  | 'STARTING'
  | 'TERMINATED';
