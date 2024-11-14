import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import Header from './components/Header'
import Genre from './pages/Genre'
import Popular from './pages/Popular'
import Latest from './pages/Latest'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/authpage' element={<AuthPage />}/>
        <Route path='/genre' element={<Genre />}/>
        <Route path='/popular' element={<Popular />}/>
        <Route path='/latest' element={<Latest />}/>
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
