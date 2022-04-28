import { IAuthData } from "./redux";

export interface ILoginResponse {
  accessToken: string;
  userInfo: IAuthData;
}
