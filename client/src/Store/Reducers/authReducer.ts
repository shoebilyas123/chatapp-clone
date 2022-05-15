import { INITIAL_USER_LOGIN } from '../../DefaultValues';
import {
  IAuthData,
  IAuthState,
  IFriends,
  IGlobalState,
  IReduxAction,
} from '../../Interface/redux';
import { ILoginResponse } from '../../Interface/responses';
import {
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REMOVE_PROFILE_PIC,
  SET_PROFILE_PIC,
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
      newSent?: IFriends;
      friends?: IFriends[];
      pendingRequests?: IFriends[];
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
        userAccessToken: action.payload?.accessToken,
      };
    case LOGIN_FAIL || USER_INFO_FAIL:
      return {
        ...state,
        success: false,
        loading: false,
        error: 'Oops! Something went wrong.',
      };
    case USER_INFO_SUCCESS:
      return {
        ...state,
        userInfo: action.payload?.userInfo,
        success: true,
        loading: false,
        fail: false,
      };
    case SEND_FR_REQUEST:
      return { ...state, inviteLoading: true };
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
        inviteLoading: false,
        inviteSent: true,
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

    case LOGOUT:
      return {};
    case SET_PROFILE_PIC:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          profilePic: (action.payload as any).profilePic,
        },
      };
    case REMOVE_PROFILE_PIC:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          profilePic: '',
        },
      };
    default:
      return { ...state };
  }
};
