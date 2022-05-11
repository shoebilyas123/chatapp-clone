import axios from 'axios';
import { Dispatch } from 'react';
import { IChatInfo } from '../../Interface/chats';
import { IFriends, IGlobalState, IReduxAction } from '../../Interface/redux';

import {
  SET_CHAT_INFO_REQUEST,
  SET_CHAT_INFO_SUCCESS,
} from '../Constants/friends';
import { RootState } from '../store';
import io from 'socket.io-client';

export const setChatInfo =
  (friend: IFriends) =>
  async (
    dispatch: Dispatch<IReduxAction<IChatInfo>>,
    getState: () => IGlobalState
  ) => {
    try {
      dispatch({ type: SET_CHAT_INFO_REQUEST });
      const { data } = await axios.get(`/api/v1/auth/chats/${friend._id}`);
      dispatch({
        type: SET_CHAT_INFO_SUCCESS,
        //   @ts-ignore-nextline
        payload: { ...friend, chatHistory: data },
      });

      const {
        userLogin: { userInfo },
        chats,
      } = getState();
      if (chats?.socket) {
        chats.socket.close();
        chats.socket = undefined;
      }

      const socket = io(
        process.env.SOCKETURL ||
          `https://chatapp-clone-shoebilyas.herokuapp.com/`
      );
      socket.emit('joinRoom', {
        from: userInfo?._id,
        to: friend._id,
      });
    } catch (err) {
      console.log(err);
    }
  };
