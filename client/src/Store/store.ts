import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { INITIAL_USER_LOGIN } from "../DefaultValues/auth";
import { IGlobalState } from "../Interface/redux";
import rootReducer from "./Reducers";

const userAccessTokenFromLocalStorage = localStorage.getItem("userAccessToken")
  ? JSON.parse(localStorage.getItem("userAccessToken") || "")
  : null;

const initialState: IGlobalState = {
  userLogin: {
    ...INITIAL_USER_LOGIN,
    userAccessToken: userAccessTokenFromLocalStorage,
  },
};

const store = createStore(rootReducer, initialState, applyMiddleware(thunk));
export type RootState = ReturnType<typeof store.getState>;
export default store;
