import axios from "axios";
import { Dispatch } from "react";
import {
  IAuthState,
  IDispatchFriends,
  IReduxAction,
} from "../../Interface/redux";
import { getAuthConfig } from "../../Utilities/api";
import {
  SEND_FR_FAIL,
  SEND_FR_REQUEST,
  SEND_FR_SUCCESS,
} from "../Constants/friends";
import { RootState } from "../store";

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
      const config = getAuthConfig({ token: userAccessToken || "" });
      const payload = { to, from };
      const { data } = await axios.post(
        "/api/v1/users/invite",
        payload,
        config
      );

      dispatch({ type: SEND_FR_SUCCESS, payload: { newSent: data.sent } });
    } catch (error) {
      console.log(error);
      dispatch({ type: SEND_FR_FAIL });
    }
  };
