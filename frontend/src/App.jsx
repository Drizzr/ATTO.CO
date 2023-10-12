import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './Routes/LandingPage/LandingPage'
import LinkHandler from './Routes/LinkHandler/LinkHandler'
import PresistLogin from './Components/PresistLogin'
import RequireAuth from './Components/RequireAuth'
import Login from './Routes/Login/Login'
import SignUp from './Routes/SignUp/SignUp'
import Home from './Routes/Home/Home'

function App() {

  return (
    <Routes path="/">
      <Route path="*" element={<LandingPage />} />
      <Route path=":shortend" element={<LinkHandler />} />
      <Route element={<PresistLogin />}>
        <Route  element={<RequireAuth />}>
          <Route path="home" element={<Home />} />
        </Route>
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="sign-up" element={<SignUp />} />
    </Routes>
  )
}

export default App
