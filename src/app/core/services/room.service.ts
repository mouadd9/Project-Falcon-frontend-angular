import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { RoomModel } from '../models/room.model';
import { InstanceOperationStarted } from '../models/instance-operation-started.model';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient) {}

  getAllRooms(userId: number): Observable<RoomModel[]> {
    return this.http.get<RoomModel[]>(
      `${environment.apiUrl}/api/users/${userId}/rooms`
    );
  }

  getRoomById(roomId: number): Observable<RoomModel> {
    return this.http.get<RoomModel>(
      `${environment.apiUrl}/api/rooms/${roomId}`
    );
  }

  getJoinedRoom(userId: number, roomId: number): Observable<RoomModel> {
    return this.http.get<RoomModel>(
      `${environment.apiUrl}/api/users/${userId}/joined-rooms/${roomId}`
    );
  }

  joinRoom(userId: number, roomId: number): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/api/users/${userId}/rooms/${roomId}/join`,
      null
    );
  }

  leaveRoom(userId: number, roomId: number): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/api/users/${userId}/rooms/${roomId}/leave`,
      null
    );
  }

  saveRoom(userId: number, roomId: number): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/api/users/${userId}/rooms/${roomId}/save`,
      null
    );
  }

  unsaveRoom(userId: number, roomId: number): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/api/users/${userId}/rooms/${roomId}/unsave`,
      null
    );
  }

  launchInstance(userId: number, roomId: number): Observable<InstanceOperationStarted> {
    // The backend endpoint is /api/instances/async?roomId=...&userId=...
    // It's not specific to a user's room collection like /api/users/{userId}/rooms/{roomId}/instances
    // Adjusting to match the backend WebSocket controller endpoint for async creation
    return this.http.post<InstanceOperationStarted>(
      `${environment.apiUrl}/api/instances/async?roomId=${roomId}&userId=${userId}`,
      null
    );
  }

  checkRoomStatus(
    userId: number,
    roomId: number
  ): Observable<{ isJoined: boolean; isSaved: boolean }> {
    return this.http.get<{ isJoined: boolean; isSaved: boolean }>(
      `${environment.apiUrl}/api/users/${userId}/rooms/${roomId}/status`
    );
  }
}
