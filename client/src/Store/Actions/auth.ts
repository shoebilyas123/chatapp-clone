import axios from "axios";
import { Dispatch } from "react";
import { ILoginPayload } from "../../API/auth";
import { URL_Common } from "../../API/common";
import { IAuthState, IReduxAction } from "../../Interface/redux";
import {
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
} from "../Constants/auth";

export const login =
  (userPayload: ILoginPayload) =>
  async (dispatch: Dispatch<IReduxAction<IAuthState>>) => {
    try {
      dispatch({ type: LOGIN_REQUEST });
      const result = await axios.post(`${URL_Common}/auth/login`, userPayload);
      dispatch({ type: LOGIN_SUCCESS, payload: result.data });
      localStorage.setItem("userInfo", JSON.stringify(result.data));
    } catch (error) {
      console.log(error);
      dispatch({ type: LOGIN_FAIL });
    }
  };

export const logout =
  () => async (dispatch: Dispatch<IReduxAction<IAuthState>>) => {
    dispatch({ type: LOGOUT });
    localStorage.removeItem("userInfo");
  };
