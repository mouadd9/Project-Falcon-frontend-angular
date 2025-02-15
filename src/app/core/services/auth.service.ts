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
    setTimeout(() => {
      this.signedInSubject.next(true);
    }, 2000);
  }

  signOut() {
    this.signedInSubject.next(false);
  }
} 
