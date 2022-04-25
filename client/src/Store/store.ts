import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { IGlobalState } from "../Interface/redux";
import rootReducer from "./Reducers";

const userInfoFromLocalStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo") || "")
  : null;

const initialState: IGlobalState = {
  userLogin: { userInfo: userInfoFromLocalStorage },
};

const store = createStore(rootReducer, initialState, applyMiddleware(thunk));
export default store;
