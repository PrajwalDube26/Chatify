import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Profile from './components/User/Profile'
import Login from './components/User/Login'
import Signup from './components/User/Signup'
import Updateuser from './components/User/Updateuser'
import Allusers from './components/User/Allusers'
import Featchparticularuser from './components/User/Featchparticularuser'
import GetFriends from './components/Friend/GetFriends'
import Getallmessage from './components/Message/Getallmessage'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/allusers" element={<Allusers />} />
        <Route path="/friends" element={<GetFriends />} />
        <Route path="/getfriends" element={<GetFriends />} />
        <Route path="/get_friends" element={<GetFriends />} />
        <Route path="/getallmessage/:id" element={<Getallmessage />} />
        <Route path="/message/:id" element={<Getallmessage />} />
        <Route path="/messages/:id" element={<Getallmessage />} />
        <Route path="/particularuser/:id" element={<Featchparticularuser />} />
        <Route path="/featchparticularuser/:id" element={<Featchparticularuser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/updateuser" element={<Updateuser />} />
      </Routes>
    </>
  )
}

export default App