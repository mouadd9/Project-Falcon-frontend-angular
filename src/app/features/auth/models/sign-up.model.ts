// models/sign-up.model.ts
export interface SignUpFormState {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
  termsAccepted: boolean;
  requestId: string | null;
  expiryDate: string | null;
}

export interface SignUpRequest {
  email: string;
  username: string;
  password: string;
  verificationCode: string;
  requestId: string;
}

export interface SignUpResponse {
  message: string;
  // add other response fields
}


// Separates concerns between verification and signup