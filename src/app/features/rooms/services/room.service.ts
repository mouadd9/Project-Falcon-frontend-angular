import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { RoomModel } from '../../my-space/models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  // these two methods will be called, to get information about a room.
  // this information should be displayed in the RoomComponent.
  // when a user clicks a room card we will call one of these to get data
  getRoomById(roomId: number): Observable<RoomModel> {
    return this.http.get<RoomModel>(`${environment.apiUrl}/api/rooms/${roomId}`);
  }

  getJoinedRoom(userId: number, roomId: number): Observable<RoomModel> {
    return this.http.get<RoomModel>(`${environment.apiUrl}/api/users/${userId}/joined-rooms/${roomId}`);
  }

  joinRoom(userId: number, roomId: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/users/${userId}/rooms/${roomId}/join`, null);
  }

  leaveRoom(userId: number, roomId: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/users/${userId}/rooms/${roomId}/leave`, null);
  }

  saveRoom(userId: number, roomId: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/users/${userId}/rooms/${roomId}/save`, null);
  }

  unsaveRoom(userId: number, roomId: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/users/${userId}/rooms/${roomId}/unsave`, null);
  }

  launchInstance(userId: number, roomId: number): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/users/${userId}/rooms/${roomId}/instances`, null);
  }

  
  /*

  @PostMapping("/{userId}/rooms/{roomId}/join")
    public ResponseEntity<Void> joinRoom(@PathVariable long userId, @PathVariable long roomId) {
        userRoomService.joinRoom(userId, roomId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/rooms/{roomId}/save")
    public ResponseEntity<Void> saveRoom(@PathVariable long userId, @PathVariable long roomId) {
        userRoomService.saveRoom(userId, roomId);
        return ResponseEntity.ok().build();
    }
  */

}
