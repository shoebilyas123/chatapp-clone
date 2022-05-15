import React, { Dispatch } from 'react';
import Login from './Routes/Auth/Login';
import Home from './Routes/Home';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IAuthData, IGlobalState, IReduxAction } from './Interface/redux';
import { getMyInfo } from './Store/Actions/auth';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Login />} path="/login" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
