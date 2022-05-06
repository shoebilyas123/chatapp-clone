import axios from 'axios';
import { Dispatch } from 'react';
import { ILoginPayload } from '../../API/auth';
import { IAuthState, IReduxAction } from '../../Interface/redux';
import { ILoginResponse } from '../../Interface/responses';
import { getAuthConfig } from '../../Utilities/api';
import {
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  USER_INFO_FAIL,
  USER_INFO_REQUEST,
  USER_INFO_SUCCESS,
} from '../Constants/auth';
import { RootState } from '../store';

export const login =
  (userPayload: ILoginPayload) =>
  async (dispatch: Dispatch<IReduxAction<IAuthState>>) => {
    try {
      dispatch({ type: LOGIN_REQUEST });
      const { data } = await axios.post<ILoginResponse>(
        '/api/v1/auth/login',
        userPayload
      );
      dispatch({
        type: LOGIN_SUCCESS,
        payload: data,
      });
      localStorage.setItem('userAccessToken', JSON.stringify(data.accessToken));
    } catch (error) {
      console.log(error);
      dispatch({ type: LOGIN_FAIL });
    }
  };

export const logout =
  () => async (dispatch: Dispatch<IReduxAction<IAuthState>>) => {
    dispatch({ type: LOGOUT });
    localStorage.removeItem('userInfo');
  };

export const getMyInfo =
  () =>
  async (
    dispatch: Dispatch<IReduxAction<IAuthState>>,
    getState: () => RootState
  ) => {
    try {
      dispatch({ type: USER_INFO_REQUEST });
      const {
        userLogin: { userAccessToken },
      } = getState();
      const config = getAuthConfig({ token: userAccessToken || '' });
      const { data } = await axios.get('/api/v1/auth/my-info', config);
      dispatch({ type: USER_INFO_SUCCESS, payload: { userInfo: data } });
    } catch (error) {
      console.log(error);
      dispatch({ type: USER_INFO_FAIL });
    }
  };
