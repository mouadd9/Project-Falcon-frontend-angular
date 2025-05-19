import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlagSubmissionService {

  constructor(private http: HttpClient) {}

  submitFlag(userId: number, challengeId: number, flag: string): Observable<{correct: boolean}> {
    return this.http.post<{correct: boolean}>(
      `${environment.apiUrl}/api/users/${userId}/challenges/${challengeId}/submit`,
      { flag }
    );
  }

}
