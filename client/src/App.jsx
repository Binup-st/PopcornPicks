import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import Header from './components/Header'
import Popular from './pages/Popular'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import Upcoming from './pages/Upcoming'
import MyWatchlist from './pages/MyWatchlist'
import Footer from './components/Footer'
import MovieDetail from './pages/MovieDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/authpage' element={<AuthPage />}/>
        <Route path='/mywatchlist' element={<MyWatchlist />}/>
        <Route path='/popular' element={<Popular />}/>
        <Route path='/upcoming' element={<Upcoming />}/>
        <Route element={<PrivateRoute />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/movie' element={<MovieDetail />} />
        </Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}
