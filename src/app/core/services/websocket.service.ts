import { Injectable } from '@angular/core';
import { CompatClient, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InstanceOperationUpdate } from '../models/instance-operation-update.model';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: CompatClient | null = null;
  private messageSubject = new Subject<InstanceOperationUpdate>();
  public messages$: Observable<InstanceOperationUpdate> = this.messageSubject.asObservable();

  constructor(private jwtService: JwtService) {}

  private getAuthToken(): string | null {
    return this.jwtService.getTokenFromLocalStorage();
  }

  public connect(userId: string, operationId: string): void {

    if (this.stompClient && this.stompClient.connected) {
      console.log('WebSocket already connected.');
      this.subscribeToUserUpdates(userId, operationId);
      return;
    }

    // we create a new websocket connection using SockJS and STOMP
    const socket = new SockJS(`${environment.apiUrl}/ws`);
    this.stompClient = Stomp.over(socket);

    // we extract the auth token from the JwtService
    // and set it in the headers for the STOMP connection
    const authToken = this.getAuthToken();
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    
    // we connect to the STOMP server
    this.stompClient.connect(headers, () => {
        console.log('WebSocket connected successfully.');
        this.subscribeToUserUpdates(userId, operationId);
      }, (error: any) => {
        console.error('Error connecting to WebSocket:', error);
        // Optionally, you could emit an error state here
      }
    );
  }

  private subscribeToUserUpdates(userId: string, operationIdToFilterBy?: string): void {
    if (this.stompClient && this.stompClient.connected) {
      // The backend InstanceWebSocketService sends to /user/{userId}/queue/instance-updates
      // The STOMP client resolves this to /user/queue/instance-updates for the authenticated user
      const userQueue = `/user/${userId}/queue/instance-updates`; // <--- KEY LINE
      this.stompClient.subscribe(userQueue, (message) => {
        try {
          const update = JSON.parse(message.body) as InstanceOperationUpdate;
          console.log('Received WebSocket update:', update);
          // If an operationId filter is provided, only emit messages for that operation
          if (operationIdToFilterBy && update.operationId === operationIdToFilterBy) {
            this.messageSubject.next(update);
          } else if (!operationIdToFilterBy) {
            // If no filter, emit all messages (though typically you'd filter)
            this.messageSubject.next(update);
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      });
      console.log(`Subscribed to ${userQueue}`);
    } else {
      console.error('STOMP client not connected. Cannot subscribe.');
    }
  }

  public disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log('WebSocket disconnected.');
      });
    }
    this.stompClient = null;
  }
}
