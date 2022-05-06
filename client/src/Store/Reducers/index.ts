import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import chatReducer from './chatReducer';
import socketReducer from './socketReducer';

export default combineReducers({
  userLogin: authReducer,
  chatInfo: chatReducer,
  socketConnection: socketReducer,
});
