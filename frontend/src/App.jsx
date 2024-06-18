import {AppRoutes} from "./routes/index.jsx";
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import React from "react";

function App() {

  return (
    <>
        <ToastContainer />
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    </>
  )
}

export default App
