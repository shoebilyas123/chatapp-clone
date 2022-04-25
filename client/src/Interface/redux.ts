export interface IAuthData {
  name: string;
  email: string;
  profilePic: string;
  accessToken: string;
}

export interface IReduxAction<P> {
  type: string;
  payload?: P;
}

export interface IReduxStateCommon {
  error?: string;
  success?: boolean;
  loading?: boolean;
}

export interface IAuthState extends IReduxStateCommon {
  userInfo?: IAuthData;
}

export interface IGlobalState {
  userLogin: {
    userInfo: IAuthData;
  } & IReduxStateCommon;
}
