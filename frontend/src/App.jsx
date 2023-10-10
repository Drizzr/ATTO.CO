import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateURL from './Routes/CreateURL/CreateURL'
import CustomNavigate from './Routes/LinkHandler/CustomNavigate'

function App() {

  return (
    <Routes path="/">
      <Route path="*" element={<CreateURL />} />
      <Route path=":shortend" element={<CustomNavigate />} />
    </Routes>
  )
}

export default App
