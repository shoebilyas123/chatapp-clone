import axios from 'axios';
import { Dispatch } from 'react';
import { toast } from 'react-toastify';
import { IChat, IChatInfo } from '../../Interface/chats';
import {
  IAcceptInvite,
  IAuthState,
  IDispatchFriends,
  IFriends,
  IGlobalState,
  IReduxAction,
} from '../../Interface/redux';
import { getAuthConfig } from '../../Utilities/api';
import { fireToast } from '../../Utilities/toast';

import {
  ACCEPT_FR_FAIL,
  ACCEPT_FR_REQUEST,
  ACCEPT_FR_SUCCESS,
  CLEAR_CHAT_FAIL,
  CLEAR_CHAT_REQUEST,
  CLEAR_CHAT_SUCCESS,
  REMOVE_FRIEND_FAIL,
  REMOVE_FRIEND_REQUEST,
  REMOVE_FRIEND_SUCCESS,
  SEND_FR_FAIL,
  SEND_FR_REQUEST,
  SEND_FR_SUCCESS,
  UPDATE_CHAT_HISTORY,
} from '../Constants/friends';
import { RootState } from '../store';

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
      fireToast({ message: 'Invite sent successfully' }).success();
    } catch (error) {
      console.log(error);
      fireToast({ message: 'Something went wrong!' }).error();
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
      fireToast({
        message: `${
          (data.friends || [])[data.friends.length - 1].name || ''
        } is now your friend`,
      }).success();
    } catch (error) {
      console.log(error);
      fireToast({ message: 'Something went wrong' }).error();
      dispatch({ type: ACCEPT_FR_FAIL });
    }
  };
export const updateChatHistory =
  (newChat: IChat) => async (dispatch: Dispatch<IReduxAction<any>>) => {
    dispatch({ type: UPDATE_CHAT_HISTORY, payload: { message: newChat } });
  };

export const deleteAllChats =
  (to: string) =>
  async (
    dispatch: Dispatch<IReduxAction<any>>,
    getState: () => IGlobalState
  ) => {
    dispatch({ type: CLEAR_CHAT_REQUEST });
    try {
      const {
        userLogin: { userAccessToken },
      } = getState();
      const config = getAuthConfig({ token: userAccessToken });
      dispatch({ type: CLEAR_CHAT_REQUEST });
      const { data } = await axios.post(
        '/api/v1/users/chats/delete-all',
        { to },
        config
      );
      dispatch({
        type: CLEAR_CHAT_SUCCESS,
        payload: { chatHistory: data.chatHistory },
      });
    } catch (err) {
      dispatch({ type: CLEAR_CHAT_FAIL });
      console.log({ err });
    }
  };

export const removeFriend =
  (removeId: string, name: string) =>
  async (
    dispatch: Dispatch<IReduxAction<IAcceptInvite>>,
    getState: () => RootState
  ) => {
    try {
      dispatch({ type: REMOVE_FRIEND_REQUEST });
      const {
        userLogin: { userAccessToken },
      } = getState();
      const config = getAuthConfig({ token: userAccessToken || '' });
      const payload = { removeId };
      const { data } = await axios.post(
        '/api/v1/auth/friends/remove',
        payload,
        config
      );

      dispatch({
        type: REMOVE_FRIEND_SUCCESS,
        payload: {
          friends: data.friends,
          pendingRequests: data.pendingRequests,
        },
      });
      fireToast({
        message: `${name} is removed from your friends list.`,
      }).success();
    } catch (error) {
      console.log(error);
      fireToast({ message: 'Something went wrong' }).error();
      dispatch({ type: REMOVE_FRIEND_FAIL });
    }
  };
