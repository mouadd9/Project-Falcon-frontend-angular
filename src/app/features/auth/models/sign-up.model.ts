
// ####################  main form Group
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


// ############################### SignUp Request
export interface SignUpRequest {
  requestId?: string; // this will be included, in the SignUpRequest
  code: string;
  email: string;
  username: string;
  password: string;
  personalInfo?: PersonalInfo;
}


// ############################### SignUp Response 

export interface SignUpResponse {
  user: UserResponse;
  token: AuthToken;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthToken {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}