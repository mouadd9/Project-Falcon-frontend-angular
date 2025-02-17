import { AuthError } from "../state/auth.reducer";

// main form Group
export interface SignUpFormValue {
  email: string;
  verificationCode: string;
  personalInfo?: PersonalInfo;
  loginInfo: LoginInfo;
  termsAccepted: boolean; // this will not be included in the sign up request
}

// each one of these will be a form group : 

export interface PersonalInfo {
    firstName: string,
    lastName: string
}

export interface LoginInfo {
  username: string,
  password: string,
  confirmPassword: string;
}

export interface SignUpRequest {
  email: string;
  verificationCode: string;
  loginInfo: LoginInfo;
  personalInfo?: PersonalInfo;
  requestId: string; // this will be included, in the SignUpRequest
}

export interface SignUpResponse {
  error: AuthError;  // for failure cases
  token: string | null;     // for success case
  refreshToken: string | null; // for success case
}