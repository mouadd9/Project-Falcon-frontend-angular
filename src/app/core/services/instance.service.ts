import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InstanceOperationStarted } from '../models/instance-operation-started.model';
import { InstanceState } from '../../features/rooms/state/instance/instance.state'; // For getInstanceForRoom return

@Injectable({
  providedIn: 'root',
})
export class InstanceService {
  private apiUrl = `${environment.apiUrl}/api/instances`;

  constructor(private http: HttpClient) {}

  /**
   * Initiates asynchronous creation of a new instance for a room.
   * @param roomId The ID of the room.
   * @param userId The ID of the user initiating the creation.
   * @returns Observable<InstanceOperationStarted>
   */
  public createInstance(roomId: string, userId: string): Observable<InstanceOperationStarted> {
    const params = new HttpParams().set('roomId', roomId).set('userId', userId);
    return this.http.post<InstanceOperationStarted>(`${this.apiUrl}/async`, {}, { params });
  }

  /**
   * Initiates asynchronous start of an existing instance.
   * @param instanceId The local database ID of the instance.
   * @returns Observable<InstanceOperationStarted>
   */
  public startInstance(instanceId: string): Observable<InstanceOperationStarted> {
    return this.http.post<InstanceOperationStarted>(`${this.apiUrl}/${instanceId}/start/async`, {});
  }

  /**
   * Initiates asynchronous stop of a running instance.
   * @param instanceId The local database ID of the instance.
   * @returns Observable<InstanceOperationStarted>
   */
  public stopInstance(instanceId: string): Observable<InstanceOperationStarted> {
    return this.http.post<InstanceOperationStarted>(`${this.apiUrl}/${instanceId}/stop/async`, {});
  }

  /**
   * Initiates asynchronous termination of an instance.
   * @param instanceId The local database ID of the instance.
   * @returns Observable<InstanceOperationStarted>
   */
  public terminateInstance(instanceId: string): Observable<InstanceOperationStarted> {
    return this.http.delete<InstanceOperationStarted>(
      `${this.apiUrl}/${instanceId}/async`
    );
  }

  /**
   * Gets the current state/details of an instance associated with a room for a specific user.
   * This is used to populate the UI when the room detail page loads.
   * @param roomId The ID of the room.
   * @param userId The ID of the user.
   * @returns Observable<Partial<InstanceState>>
   */
  public getInstanceForRoom(roomId: string, userId: string): Observable<Partial<InstanceState>> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<Partial<InstanceState>>(
      `${environment.apiUrl}/api/rooms/${roomId}/instance_details`,
      { params }
    );
  }

  /**
   * Downloads VPN configuration file for a user.
   * @param username The username for which to generate the VPN config.
   * @returns Observable<Blob> - The .ovpn file as a blob
   */
  public downloadVpnConfig(username: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/api/vpn/users/${username}/config`, {
      responseType: 'blob',
    });
  }
}
