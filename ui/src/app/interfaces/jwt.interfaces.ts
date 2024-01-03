export interface VerifyToken {
   verify_token: {
      username: string;
      iat: number;
      exp: number;
   };
}

export interface Token {
   access_token: string;
}

export interface GetTokenPayload {
   username: string;
   password: string;
}

