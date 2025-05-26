/**
 * Represents the immediate response from the backend when an instance operation is initiated.
 * This confirms the operation has been accepted and provides details for tracking.
 */
export interface InstanceOperationStarted {
  operationId: string;      // Unique ID for the backend operation
  status: string;           // e.g., "ACCEPTED"
  message: string;
  estimatedDuration?: string;
  instanceId?: string;      // The local database ID of the instance, if known (e.g., for START, STOP, TERMINATE)
  operationType: 'CREATE' | 'START' | 'STOP' | 'TERMINATE' | string; // Type of operation initiated
  timestamp: string;        // ISO date string
  websocketTopic: string;   // The specific WebSocket topic to listen on (e.g., /user/{userId}/queue/instance-updates)
}
