// ტიპის დეკლარაციები ყოველთვის PascalCase-ში!
export interface SignIn {
  username: string;
  password: string;
  setCookie: boolean;
}

export interface SignInResponse {
  succeeded: boolean;
  hasViewPermission: any;
  data: data;
  errors: [];
  messages: [];
}

interface data {
  authToken: string;
  refreshToken: string;
  validateTill: string;
}

export interface SignInErrors {
  signIn: string;
}
