import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Profile from './components/User/Profile'
import Login from './components/User/Login'
import Signup from './components/User/Signup'
import Updateuser from './components/User/Updateuser'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/updateuser" element={<Updateuser />} />
      </Routes>
    </>
  )
}

export default App