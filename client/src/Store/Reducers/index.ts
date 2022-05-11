import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import chatReducer from './chatReducer';

export default combineReducers({
  userLogin: authReducer,
  chats: chatReducer,
});
