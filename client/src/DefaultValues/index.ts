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
  inviteLoading: false,
  inviteSent: false,
};

export const INITIAL_CHAT_INFO: IGlobalState['chats'] = {
  chatHistory: [],
  chatsError: '',
  chatsLoading: false,
  chatsSuccess: false,
  avatarColor: '',
  profilePic: '',
  name: '',
  _id: '',
};
