import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateURL from './Routes/CreateURL/CreateURL'
import LinkHandler from './Routes/LinkHandler/LinkHandler'

function App() {

  return (
    <Routes path="/">
      <Route path="*" element={<CreateURL />} />
      <Route path=":shortend" element={<LinkHandler />} />
    </Routes>
  )
}

export default App
