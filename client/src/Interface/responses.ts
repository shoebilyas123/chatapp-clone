import { IAuthData } from './redux';

export interface ILoginResponse {
  accessToken: string;
  userInfo: IAuthData;
}
export interface IUpdateInfo {
  name: string;
  email: string;
}
