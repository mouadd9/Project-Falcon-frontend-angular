import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { JwtService } from './jwt.service';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { GlobalRoomStats, ProfileStatistics } from '../models/statistics.model';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl = `${environment.apiUrl}/api/statistics`;
  constructor(private http: HttpClient, private jwtService: JwtService) {}

  private getUserId(): number | null {
    return this.jwtService.getUserIdFromToken();
  }

  getProfileStatistics(): Observable<ProfileStatistics> {
    const userId = this.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated or user ID not found in token'));
    }
    return this.http.get<ProfileStatistics>(`${this.apiUrl}/profile/${userId}`);
  }

  getGlobalRoomStatistics(): Observable<GlobalRoomStats> {
    const userId = this.getUserId();
     if (!userId) {
      return throwError(() => new Error('User not authenticated or user ID not found in token'));
    }
    return this.http.get<GlobalRoomStats>(`${this.apiUrl}/rooms/global/${userId}`);
  }
}
