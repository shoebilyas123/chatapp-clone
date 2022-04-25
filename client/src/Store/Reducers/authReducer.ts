import { IAuthData, IAuthState, IReduxAction } from "../../Interface/redux";
import {
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
} from "../Constants/auth";

export default (state: IAuthState = {}, action: IReduxAction<IAuthData>) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true };
    case LOGIN_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        userInfo: action.payload,
      };
    case LOGIN_FAIL:
      return { ...state, success: false, loading: false, fail: true };

    case LOGOUT:
      return {};
    default:
      return { ...state };
  }
};
