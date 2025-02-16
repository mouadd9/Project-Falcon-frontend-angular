import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VerificationCodeRequest, VerificationCodeResponse } from '../models/verification.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root' // provided at root, the root injector creates a singleton of this service
})
export class AuthService {

    constructor(private http: HttpClient) { }

    public sendVerificationCode(codeRequest: VerificationCodeRequest): Observable<VerificationCodeResponse> {
        return this.http.post<VerificationCodeResponse>(`${environment.apiUrl}/auth/send-code`, codeRequest);
    }

}
// alright the user will enter his email and then clicks send code
// the request will have 