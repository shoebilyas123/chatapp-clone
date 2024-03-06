export interface IInviteRequests {
  name: string;
  profilePic: string;
  id: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  profilePic?: string;
  friends: IUser[] | string[];
  pendingRequests: IInviteRequests[];
  sentRequests: IInviteRequests[];
  avatarColor: string;
}
