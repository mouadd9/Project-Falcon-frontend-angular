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
  
  // Tracker la souscription active
  private currentSubscription: any = null;

  constructor(private jwtService: JwtService) {}

  private getAuthToken(): string | null {
    return this.jwtService.getTokenFromLocalStorage();
  }

  public connect(userId: string): void {
    // Clean up existing subscription
    if (this.currentSubscription) {
      console.log('Unsubscribing from previous WebSocket subscription');
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }
    
    // Check if already connected
    if (this.stompClient && this.stompClient.connected) {
      console.log('WebSocket already connected.');
      this.subscribeToUserUpdates(userId);
      return;
    }

    // if not connected we Create new connection
    const socket = new SockJS(`${environment.apiUrl}/ws`);
    this.stompClient = Stomp.over(socket);

    // we extract the auth token from the JwtService
    // and set it in the headers for the STOMP connection
    const authToken = this.getAuthToken();
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    
    // we connect to the STOMP server
    this.stompClient.connect(headers, () => {
        console.log('WebSocket connected successfully.'); // this is sufficient no need to dispatch an action
        this.subscribeToUserUpdates(userId);
      }, (error: any) => {
        console.error('Error connecting to WebSocket:', error);
        // Optionally, you could emit an error state here
      }
    );
  }

  private subscribeToUserUpdates(userId: string): void {
    if (this.stompClient && this.stompClient.connected) {
      // The backend InstanceWebSocketService sends to /user/{userId}/queue/instance-updates
      // The STOMP client resolves this to /user/queue/instance-updates for the authenticated user
      const userQueue = `/user/${userId}/queue/instance-updates`; // <--- KEY LINE
      
      this.currentSubscription = this.stompClient.subscribe(userQueue, (message) => {
        try {
          const update = JSON.parse(message.body) as InstanceOperationUpdate;
          console.log('Received WebSocket update:', update);
            this.messageSubject.next(update);
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
    if (this.currentSubscription) {
      console.log('Unsubscribing from WebSocket subscription');
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }

    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log('WebSocket disconnected.');
      });
    }
    this.stompClient = null;
  }
}
