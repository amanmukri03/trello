import './styles/global.css'
import { Routes, Route, HashRouter } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Board from './pages/Board'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Landing from './components/Landing'

const App = () => {
  return (
    <>
      <HashRouter> 
    <Navbar/>

        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/board" element={
            <ProtectedRoute>
              <Board />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Login />} />
        </Routes>
      </HashRouter>

  </>
  )
}

export default App
