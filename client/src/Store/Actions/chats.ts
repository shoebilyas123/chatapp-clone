import axios from 'axios';
import { Dispatch } from 'react';
import { IChatInfo } from '../../Interface/chats';
import { IFriends, IGlobalState, IReduxAction } from '../../Interface/redux';

import {
  SET_CHAT_INFO_FAILURE,
  SET_CHAT_INFO_REQUEST,
  SET_CHAT_INFO_SUCCESS,
  SHOW_ONLINE,
} from '../Constants/friends';
import io from 'socket.io-client';
import { getAuthConfig } from '../../Utilities/api';

export const setChatInfo =
  (friend: IFriends) =>
  async (
    dispatch: Dispatch<IReduxAction<IChatInfo>>,
    getState: () => IGlobalState
  ) => {
    try {
      dispatch({ type: SET_CHAT_INFO_REQUEST });
      const {
        userLogin: { userInfo, userAccessToken },
        chats,
      } = getState();

      const config = getAuthConfig({ token: userAccessToken });

      const response = await axios.get(
        `/api/v1/auth/chats/${friend._id}`,
        config
      );

      if (chats?.socket) {
        chats.socket.close();
        chats.socket = undefined;
      }

      const socket = io(
        // 'http://localhost:8000'
        `https://chatapp-clone-shoebilyas.herokuapp.com/`
      );
      socket.emit('joinRoom', {
        from: userInfo?._id,
        to: friend._id,
      });
      dispatch({
        type: SET_CHAT_INFO_SUCCESS,
        //   @ts-ignore-nextline
        payload: { ...friend, socket, chatHistory: response.data || [] },
      });
    } catch (err) {
      dispatch({
        type: SET_CHAT_INFO_FAILURE,
        // @ts-ignore-nextline
        payload: { chatsError: err.response.data.error },
      });
    }
  };

export const showOnline =
  () => async (dispatch: Dispatch<IReduxAction<IChatInfo>>) => {
    dispatch({ type: SHOW_ONLINE });
  };
