import React from "react";
import Login from "./Routes/Auth/Login";
import Home from "./Routes/Home";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";

function App() {
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
