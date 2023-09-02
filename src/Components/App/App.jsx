import React, { createContext, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from '../LoginComponent/Login.jsx';
import Dashboard from '../DashboardComponent/Dashboard.jsx';

const InfoContext = createContext();

const App = () => {
  const [loginWithNewRoom, setLoginWithNewRoom] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <InfoContext.Provider value={setLoginWithNewRoom}>
              <Login />
            </InfoContext.Provider>
          } />
          <Route path='/room/:roomId' element={
            <InfoContext.Provider value={{loginWithNewRoom,setLoginWithNewRoom}}>
              <Dashboard />
            </InfoContext.Provider>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
export {InfoContext};