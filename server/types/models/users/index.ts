import { GlobalDocWrapper } from '../..';

export interface IInviteRequests {
  name: string;
  profilePic: string;
  avatarColor: string;
  _id: string;
}

export interface IUser extends GlobalDocWrapper {
  name: string;
  email: string;
  password?: string;
  profilePic?: string;
  friends?: IUser[] | string[];
  pendingRequests?: IInviteRequests[];
  sentRequests?: IInviteRequests[];
  avatarColor?: string;
}
