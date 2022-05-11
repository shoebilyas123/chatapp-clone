import { INITIAL_CHAT_INFO, INITIAL_USER_LOGIN } from '../../DefaultValues';
import { IFriends, IGlobalState, IReduxAction } from '../../Interface/redux';
import { ILoginResponse } from '../../Interface/responses';

import {
  SET_CHAT_INFO_REQUEST,
  SET_CHAT_INFO_SUCCESS,
} from '../Constants/friends';

export default (
  state: IGlobalState['chats'] = INITIAL_CHAT_INFO,
  action: IReduxAction<any>
) => {
  switch (action.type) {
    case SET_CHAT_INFO_REQUEST:
      return { ...state, chatsLoading: true };
    case SET_CHAT_INFO_SUCCESS:
      return {
        ...state,
        ...action.payload,
        chatsLoading: false,
        chatsSuccess: true,
      };
    default:
      return { ...state };
  }
};
