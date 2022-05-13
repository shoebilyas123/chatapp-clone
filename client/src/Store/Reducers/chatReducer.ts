import { INITIAL_CHAT_INFO } from '../../DefaultValues';
import { IChatInfo } from '../../Interface/chats';
import { IGlobalState, IReduxAction } from '../../Interface/redux';
import {
  SET_CHAT_INFO_FAILURE,
  SET_CHAT_INFO_REQUEST,
  SET_CHAT_INFO_SUCCESS,
} from '../Constants/friends';

export default (
  state: IGlobalState['chats'] = INITIAL_CHAT_INFO,
  action: IReduxAction<IChatInfo>
) => {
  switch (action.type) {
    case SET_CHAT_INFO_REQUEST:
      return { ...state, chatsLoading: true };
    case SET_CHAT_INFO_SUCCESS:
      return {
        ...state,
        ...action.payload,
        chatsLoading: false,
        chatsError: '',
        chatsSuccess: true,
      };
    case SET_CHAT_INFO_FAILURE:
      return {
        ...state,
        chatsError: action.payload?.chatsError,
        chatsLoading: false,
        chatsSuccess: false,
      };
    default:
      return { ...state };
  }
};
