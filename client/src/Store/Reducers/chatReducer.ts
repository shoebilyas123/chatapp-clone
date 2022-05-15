import { INITIAL_CHAT_INFO } from '../../DefaultValues';
import { IChat, IChatInfo } from '../../Interface/chats';
import { IGlobalState, IReduxAction } from '../../Interface/redux';
import {
  CLEAR_CHAT_REQUEST,
  CLEAR_CHAT_SUCCESS,
  SET_CHAT_INFO_FAILURE,
  SET_CHAT_INFO_REQUEST,
  SET_CHAT_INFO_SUCCESS,
  SHOW_ONLINE,
  UPDATE_CHAT_HISTORY,
} from '../Constants/friends';

interface IPayloadExtra {
  message: IChat;
}

export default (
  state: IGlobalState['chats'] = INITIAL_CHAT_INFO,
  action: IReduxAction<IChatInfo & IPayloadExtra>
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
    case UPDATE_CHAT_HISTORY:
      return {
        ...state,
        chatHistory: [...state?.chatHistory, action.payload?.message],
      };
    case CLEAR_CHAT_REQUEST:
      return { ...state, chatsLoading: true };
    case CLEAR_CHAT_SUCCESS:
      return {
        ...state,
        chatHistory: [],
        chatsLoading: false,
        chatsSuccess: true,
      };
    case SHOW_ONLINE:
      return { ...state, isOnline: true };
    default:
      return { ...state };
  }
};
