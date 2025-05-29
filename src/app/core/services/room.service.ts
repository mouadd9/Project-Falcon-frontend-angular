import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { RoomModel } from '../models/room.model';
import { InstanceOperationStarted } from '../models/instance-operation-started.model';
import { RoomFilterCriteria } from '../../features/rooms/state/rooms/rooms.actions';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient) {}

  getAllRooms(userId: number, criteria?: RoomFilterCriteria): Observable<RoomModel[]> {
    let params = new HttpParams();
    
    if (criteria) {
      if (criteria.complexity) {
        params = params.set('complexity', criteria.complexity);
      }
      if (criteria.enrollmentStatus) {
        params = params.set('enrollmentStatus', criteria.enrollmentStatus);
      }
      if (criteria.completionStatus) {
        params = params.set('completionStatus', criteria.completionStatus);
      }
      if (criteria.searchTerm) {
        params = params.set('searchTerm', criteria.searchTerm);
      }
      if (criteria.sortBy) {
        params = params.set('sortBy', criteria.sortBy);
      }
    }

    return this.http.get<RoomModel[]>(
      `${environment.apiUrl}/api/users/${userId}/rooms`,
      { params }
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
