import { IChatInfo } from './chats';

export interface IFriends {
  name: string;
  profilePic: string;
  avatarColor: string;
  _id: string;
}

export interface IAuthData {
  name: string;
  email: string;
  profilePic: string;
  sentRequests: IFriends[];
  pendingRequests: IFriends[];
  friends: IFriends[];
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

export interface IAcceptInvite extends IReduxStateCommon {
  friends: IFriends[];
  pendingRequests: IFriends[];
}

export interface ISocket {
  socket: any;
}

export interface IGlobalState {
  userLogin: {
    userInfo?: IAuthData;
    userAccessToken: string;
    inviteLoading: boolean;
    inviteSent: boolean;
  } & IReduxStateCommon;
  chats?: IChatInfo;
  socketConnection?: ISocket;
}
