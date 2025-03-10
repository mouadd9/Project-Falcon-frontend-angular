
// ####################  main form Group
export interface SignUpFormValue {
  email: string;
  verificationCode: string;
  loginInfo: LoginInfo;
  termsAccepted: boolean; // this will not be included in the sign up request
}

// each one of these will be a form group : 

export interface LoginInfo {
  username: string,
  password: string,
  confirmPassword: string;
}

/*export interface PersonalInfo {
    firstName: string,
    lastName: string
}*/

// ############################### SignUp Request
export interface SignUpRequest {
  requestId?: string; // this will be included, in the SignUpRequest
  code: string;
  email: string;
  username: string;
  password: string;
 // personalInfo?: PersonalInfo;
}


// ############################### SignUp Response 
export interface SignUpResponse {
  'access-token': string;
}
