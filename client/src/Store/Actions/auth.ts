import axios from 'axios';
import { Dispatch } from 'react';
import { toast } from 'react-toastify';
// import { toast } from 'react-toastify';

import { ILoginPayload, IRegisterPayload } from '../../API/auth';
import {
  IAuthData,
  IAuthState,
  IGlobalState,
  IReduxAction,
} from '../../Interface/redux';
import { ILoginResponse, IUpdateInfo } from '../../Interface/responses';
import { getAuthConfig } from '../../Utilities/api';
import { fireToast } from '../../Utilities/toast';
import {
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  UPDATE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
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

      toast.success(`Welcome back ${data.userInfo.name}!`, {
        position: 'top-center',
      });

      localStorage.setItem('userAccessToken', JSON.stringify(data.accessToken));
    } catch (error) {
      dispatch({ type: LOGIN_FAIL });
    }
  };

export const register =
  (userPayload: IRegisterPayload) =>
  async (dispatch: Dispatch<IReduxAction<IAuthState>>) => {
    try {
      dispatch({ type: LOGIN_REQUEST });
      const { data } = await axios.post<ILoginResponse>(
        '/api/v1/auth/register',
        userPayload
      );
      dispatch({
        type: LOGIN_SUCCESS,
        payload: data,
      });
      toast.success(`Welcome ${data.userInfo.name}`);
      localStorage.setItem('userAccessToken', JSON.stringify(data.accessToken));
    } catch (error) {
      toast.error((error as any)?.response.data.error);
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

      const config = getAuthConfig({ token: userAccessToken });
      const { data } = await axios.get('/api/v1/auth/my-info', config);

      dispatch({ type: USER_INFO_SUCCESS, payload: { userInfo: data } });
    } catch (error) {
      console.log(error);
      dispatch({ type: USER_INFO_FAIL });
    }
  };

export const updateUserInfo =
  (userInfo: IUpdateInfo) =>
  async (
    dispatch: Dispatch<IReduxAction<IAuthState> & { userInfo?: IAuthData }>,
    getState: () => IGlobalState
  ) => {
    try {
      dispatch({ type: UPDATE_USER_REQUEST });
      const {
        userLogin: { userAccessToken },
      } = getState();

      const config = getAuthConfig({ token: userAccessToken });
      const { data } = await axios.post(
        '/api/v1/auth/update',
        {
          ...userInfo,
        },
        config
      );
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { userInfo: data },
      });
      fireToast({ message: 'User info updated successfully' }).success();
    } catch (error) {
      fireToast({ message: 'Cannot update info :(' }).error();
      dispatch({ type: UPDATE_USER_FAIL });
    }
  };
