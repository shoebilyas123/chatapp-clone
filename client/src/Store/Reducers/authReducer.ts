import { INITIAL_USER_LOGIN } from '../../DefaultValues';
import {
  IAuthData,
  IAuthState,
  IFRRequests,
  IGlobalState,
  IReduxAction,
} from '../../Interface/redux';
import { ILoginResponse } from '../../Interface/responses';
import {
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  USER_INFO_FAIL,
  USER_INFO_REQUEST,
  USER_INFO_SUCCESS,
} from '../Constants/auth';
import {
  SEND_FR_REQUEST,
  SEND_FR_SUCCESS,
  ACCEPT_FR_REQUEST,
  ACCEPT_FR_SUCCESS,
  ACCEPT_FR_FAIL,
  UPDATE_CHAT_HISTORY,
  CLEAR_CHAT_SUCCESS,
  CLEAR_CHAT_REQUEST,
} from '../Constants/friends';

export default (
  state: IGlobalState['userLogin'] = INITIAL_USER_LOGIN,
  action: IReduxAction<
    ILoginResponse & {
      newSent?: IFRRequests;
      friends?: IFRRequests[];
      pendingRequests?: IFRRequests[];
    }
  >
) => {
  switch (action.type) {
    case LOGIN_REQUEST || USER_INFO_REQUEST:
      return { ...state, loading: true };
    case LOGIN_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        userInfo: action.payload?.userInfo,
        accessToken: action.payload?.accessToken,
      };
    case LOGIN_FAIL || USER_INFO_FAIL:
      return { ...state, success: false, loading: false, fail: true };
    case USER_INFO_SUCCESS:
      return { ...state, userInfo: action.payload?.userInfo, loading: false };
    case SEND_FR_REQUEST:
      return { ...state, sendingInvite: true };
    case SEND_FR_SUCCESS:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          sentRequests: [
            ...(state.userInfo?.sentRequests || []),
            action.payload?.newSent,
          ],
        },
        sendingInvite: false,
        inviteSuccess: true,
      };
    case ACCEPT_FR_REQUEST:
      return { ...state };
    case ACCEPT_FR_SUCCESS:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          pendingRequests: action.payload?.pendingRequests,
          friends: action.payload?.friends,
        },
      };
    case UPDATE_CHAT_HISTORY:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          chatHistory: [
            ...state.userInfo?.chatHistory,
            (action.payload as any).message,
          ],
        },
      };
    case CLEAR_CHAT_REQUEST:
      return { ...state, chatsLoading: true };
    case CLEAR_CHAT_SUCCESS:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          chatHistory: (action.payload as any).chatHistory,
        },
        chatsLoading: false,
      };
    case LOGOUT:
      return {};
    default:
      return { ...state };
  }
};
