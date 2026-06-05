import React from 'react'
import {BrowserRouter,Routes,Route,} from 'react-router-dom'
import Navbar from './Components/Navbar'
import Home from './Components/Home/Home'
import Signup from './Components/Auth/Signup'
import Login from './Components/Auth/Login'
import Create_blog from './Components/Home/Create_blog'
import Otp from './Components/Otp/Otp'


export default function App() {

  return (

    <div>

      <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path='/' element={<Home />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/create-blog' element={<Create_blog />}/>
        <Route path='/otp-verify/:id' element={<Otp />}/>

      </Routes>
      </BrowserRouter>

    </div>
  )
}