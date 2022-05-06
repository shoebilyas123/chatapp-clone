import { IGlobalState } from '../Interface/redux';

export const INITIAL_USER_LOGIN: IGlobalState['userLogin'] = {
  userInfo: {
    _id: '',
    name: '',
    email: '',
    profilePic: '',
    sentRequests: [],
    pendingRequests: [],
    friends: [],
    avatarColor: '',
  },
  userAccessToken: '',
  sendingInvite: false,
  inviteSuccess: false,
};

export const INITIAL_CHAT_INFO: IGlobalState['chatInfo'] = {
  chatHistory: [],
  avatarColor: '',
  profilePic: '',
  name: '',
  _id: '',
};
