import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './Routes/LandingPage/LandingPage'
import LinkHandler from './Routes/LinkHandler/LinkHandler'
import PresistLogin from './Components/PresistLogin'

function App() {

  return (
    <Routes path="/">
      <Route path="*" element={<LandingPage />} />
      <Route path=":shortend" element={<LinkHandler />} />
    </Routes>
  )
}

export default App
