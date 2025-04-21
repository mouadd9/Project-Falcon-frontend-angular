import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { RoomModel } from '../models/room.model';



// this service will make api calls to get joined/completed/saved rooms
// these services will be used by effects 
// when a user dispatches an action, like getJoinedRooms effects will react to that action by calling methods from here and subscribing to the observables they return,
// after subscription we wait for response

// if succesful we change the state. by updating the rooms.

@Injectable({
    providedIn: 'root', // provided at root, the root injector creates a singleton of this service
  })
export class MyRoomsService {
  constructor(private http: HttpClient) {}

  // this method returns an observable that emits a list of joined rooms
  public getJoinedRooms(userId: number): Observable<RoomModel[]> {
    return this.http.get<RoomModel[]>(`${environment.apiUrl}/api/users/${userId}/joined-rooms`);
  }

  public getSavedRooms(userId: number): Observable<RoomModel[]> {
    return this.http.get<RoomModel[]>(`${environment.apiUrl}/api/users/${userId}/saved-rooms`);
  }

  public getCompletedRooms(userId: number): Observable<RoomModel[]> {
    return this.http.get<RoomModel[]>(`${environment.apiUrl}/api/users/${userId}/completed-rooms`);
  }

}