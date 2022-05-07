import { IChatInfo } from './chats';

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
  pendingRequests: IFRRequests[];
  chatHistory: any;
  friends: IFRRequests[];
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
  friends: IFRRequests[];
  pendingRequests: IFRRequests[];
}

export interface ISocket {
  socket: any;
}

export interface IGlobalState {
  userLogin: {
    userInfo?: IAuthData;
    userAccessToken: string;
    sendingInvite: boolean;
    inviteSuccess: boolean;
    chatsLoading: boolean;
  } & IReduxStateCommon;
  chatInfo?: IChatInfo;
  socketConnection?: ISocket;
}
