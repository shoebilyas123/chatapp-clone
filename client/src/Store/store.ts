import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { INITIAL_USER_LOGIN } from '../DefaultValues';
import { IGlobalState } from '../Interface/redux';
import rootReducer from './Reducers';

const userAccessTokenFromLocalStorage = localStorage.getItem('userAccessToken')
  ? JSON.parse(localStorage.getItem('userAccessToken') || '')
  : null;

const initialState: IGlobalState = {
  userLogin: {
    userAccessToken: userAccessTokenFromLocalStorage,
    inviteLoading: false,
    inviteSent: false,
    loading: true,
  },
  chats: undefined,
  socketConnection: undefined,
};

const store = createStore(
  rootReducer,
  // @ts-ignore
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);
export type RootState = ReturnType<typeof store.getState>;
export default store;
