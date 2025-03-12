export interface SignInFormValue {
  username: string;
  password: string;
  termsAccepted: boolean;
}

export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignInResponse {
  'access-token': string;
}