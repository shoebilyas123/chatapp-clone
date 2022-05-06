import { INITIAL_CHAT_INFO } from '../../DefaultValues';
import { IChatInfo } from '../../Interface/chats';
import { IGlobalState, IReduxAction } from '../../Interface/redux';
import { SET_CHAT_INFO } from '../Constants/friends';

export default (
  state: IGlobalState['chatInfo'] = INITIAL_CHAT_INFO,
  action: IReduxAction<IChatInfo>
) => {
  switch (action.type) {
    case SET_CHAT_INFO:
      return { ...state, ...action.payload };
    default:
      return { ...state };
  }
};
