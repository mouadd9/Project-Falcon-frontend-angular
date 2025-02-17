import { AuthError } from "../state/auth.reducer";

export interface VerificationCodeRequest {
    email: string;
}

export interface VerificationCodeResponse {
    requestId: string | null;
    error: AuthError;
    expiryDate: string | null; // this will be used as for countdown
}

  