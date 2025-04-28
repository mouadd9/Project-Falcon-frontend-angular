import { HttpClient } from '@angular/common/http';
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

}
