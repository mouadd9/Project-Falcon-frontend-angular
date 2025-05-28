import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('access-token');
  }
  
  // Decode a JWT token and return the payload 
  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token specified:', error);
      return null;
    }
  }
  
  // Extract the expiration timestamp from a JWT token
  getExpiresAt(token: string): number | null {
    try {
      const decodedToken: any = this.decodeToken(token);
      // JWT typically uses the 'exp' claim for expiration timestamp
      return decodedToken ? decodedToken.exp * 1000 : null; // Convert to milliseconds
    } catch (error) {
      console.error('Error extracting expiration time:', error);
      return null;
    }
  }
  
  // Check if a JWT token has expired
  isTokenExpired(token: string): boolean {
    const expiresAt = this.getExpiresAt(token);
    return expiresAt ? Date.now() > expiresAt : true;
  }

  getUserIdFromToken(): number {
    const token = localStorage.getItem('access-token');
    if (!token) return 0;
    const decoded = this.decodeToken(token);
    return decoded.userId;
  }

  getUsernameFromToken(): string | null {
    const token = localStorage.getItem('access-token');
    if (!token) return null;
    const decoded = this.decodeToken(token);
    return decoded.sub || "username";
  }
}