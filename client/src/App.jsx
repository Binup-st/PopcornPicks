import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Header from './components/Header'
import Genre from './pages/Genre'
import Popular from './pages/Popular'
import Latest from './pages/Latest'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/signin' element={<Signin />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/genre' element={<Genre />}/>
        <Route path='/popular' element={<Popular />}/>
        <Route path='/latest' element={<Latest />}/>
      </Routes>
    </BrowserRouter>
  )
}
