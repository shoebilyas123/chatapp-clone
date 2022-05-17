import React, { Dispatch } from 'react';
import Login from './Routes/Auth/Login';
import Home from './Routes/Home';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IAuthData, IGlobalState, IReduxAction } from './Interface/redux';
import { getMyInfo } from './Store/Actions/auth';
import Register from './Routes/Auth/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <BrowserRouter>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
