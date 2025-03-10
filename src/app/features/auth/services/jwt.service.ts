import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  
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
}