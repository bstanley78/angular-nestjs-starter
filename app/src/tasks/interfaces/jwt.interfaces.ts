export interface VerifyToken extends Document {
   verify_token: {
      username: string;
      iat: number;
      exp: number;
   };
}
