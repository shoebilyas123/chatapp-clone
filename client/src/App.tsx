import React, { Dispatch } from "react";
import Login from "./Routes/Auth/Login";
import Home from "./Routes/Home";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IAuthData, IGlobalState, IReduxAction } from "./Interface/redux";
import { getMyInfo } from "./Store/Actions/auth";

function App() {
  const dispatch: Dispatch<any> = useDispatch();
  const { userInfo } = useSelector((state: IGlobalState) => state.userLogin);

  React.useEffect(() => {
    if (!userInfo) {
      dispatch(getMyInfo());
    }
  }, [userInfo]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Login />} path="/login" />
          <Route element={<Home />} path="/" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
