// verification process models

//               email ------> server 
// requestId + expDate <------ server 

// this is the object that will be sent when the user clicks send code
export interface VerificationCodeRequest {
    email: string;
  }

// this is the object that will be received when the response comes back after sending code
export interface VerificationCodeResponse {
    requestId: string;
    message: string;
    expiryDate: string;
  }
  