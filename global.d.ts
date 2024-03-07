import { IUser } from './src/types/models/users';

declare global {
  namespace Express {
    export interface Request {
      user: IUser;
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string | number;
      MONGO_URI: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      REGION: string;
      BUCKET_NAME: string;
      ACCESS_KEY_ID: string;
      SECRET_ACCESS_KEY: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string | number;
    }
  }
}
