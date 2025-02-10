import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private signedInSubject = new BehaviorSubject<boolean>(false);
  signedIn$: Observable<boolean> = this.signedInSubject.asObservable();

  constructor() { }

  get signedIn(): boolean {
    return this.signedInSubject.value;
  }

  signIn() {
    this.signedInSubject.next(true);
  }

  signOut() {
    this.signedInSubject.next(false);
  }
}
