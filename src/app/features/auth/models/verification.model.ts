export interface VerificationCodeRequest {
    email: string;
}

export interface VerificationCodeResponse {
    requestId: string;
    message: string;
    expiryDate: string; // this will be used as for countdown
}
  