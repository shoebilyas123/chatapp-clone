import axios from 'axios';
import { Dispatch } from 'react';
import { IChatInfo } from '../../Interface/chats';
import {
  IAcceptInvite,
  IAuthState,
  IDispatchFriends,
  IFRRequests,
  IGlobalState,
  IReduxAction,
} from '../../Interface/redux';
import { getAuthConfig } from '../../Utilities/api';
import {
  ACCEPT_FR_FAIL,
  ACCEPT_FR_REQUEST,
  ACCEPT_FR_SUCCESS,
  SEND_FR_FAIL,
  SEND_FR_REQUEST,
  SEND_FR_SUCCESS,
  SET_CHAT_INFO,
} from '../Constants/friends';
import { RootState } from '../store';
import { SOCKET_INIT } from '../Constants/socket';
import io from 'socket.io-client';

interface IInviteResponse {
  name: string;
  profilePic: string;
  avatarColor: string;
  _id: string;
}

export const sendInvite =
  (to: string, from: string) =>
  async (
    dispatch: Dispatch<IReduxAction<IDispatchFriends>>,
    getState: () => RootState
  ) => {
    try {
      dispatch({ type: SEND_FR_REQUEST });
      const {
        userLogin: { userAccessToken },
      } = getState();
      const config = getAuthConfig({ token: userAccessToken || '' });
      const payload = { to, from };
      const { data } = await axios.post(
        '/api/v1/users/invite',
        payload,
        config
      );

      dispatch({ type: SEND_FR_SUCCESS, payload: { newSent: data.sent } });
    } catch (error) {
      console.log(error);
      dispatch({ type: SEND_FR_FAIL });
    }
  };

export const acceptInvite =
  (acceptId: string) =>
  async (
    dispatch: Dispatch<IReduxAction<IAcceptInvite>>,
    getState: () => RootState
  ) => {
    try {
      dispatch({ type: ACCEPT_FR_REQUEST });
      const {
        userLogin: { userAccessToken },
      } = getState();
      const config = getAuthConfig({ token: userAccessToken || '' });
      const payload = { acceptId };
      const { data } = await axios.post(
        '/api/v1/users/invite/accept',
        payload,
        config
      );

      dispatch({
        type: ACCEPT_FR_SUCCESS,
        payload: {
          friends: data.friends,
          pendingRequests: data.pendingRequests,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({ type: ACCEPT_FR_FAIL });
    }
  };

export const setChatInfo =
  (info: IChatInfo) =>
  (
    dispatch: Dispatch<IReduxAction<IChatInfo>>,
    getState: () => IGlobalState
  ) => {
    const {
      userLogin: { userAccessToken, userInfo },
    } = getState();
    const socket = io(`http://localhost:8000`);
    socket.emit('joinRoom', {
      from: userInfo?._id,
      to: info._id,
    });
    dispatch({ type: SET_CHAT_INFO, payload: { ...info, socket } });
  };
