export interface IFRRequests {
  name: string;
  profilePic: string;
  avatarColor: string;
  _id: string;
}

export interface IAuthData {
  name: string;
  email: string;
  profilePic: string;
  sentRequests: IFRRequests[];
  pendingRequests: any;
  friends: any;
  avatarColor: string;
  _id: string;
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

export interface IDispatchFriends extends IReduxStateCommon {
  newSent: any;
}

export interface IGlobalState {
  userLogin: {
    userInfo?: IAuthData;
    userAccessToken: string;
    sendingInvite: boolean;
    inviteSuccess: boolean;
  } & IReduxStateCommon;
}
