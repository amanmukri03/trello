import React, { useEffect } from 'react'
import'./styles/global.css'
import {BrowserRouter, Routes, Route, useNavigate, HashRouter } from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import Board from './pages/Board';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';


const App = () => {

  return (
    <HashRouter basename="/trello">
    <div className='app-container'>
      <Routes>
        <Route path="/board" element={<Board/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
        <Route path="/board" element={<ProtectedRoute><Board/></ProtectedRoute>}/>
        <Route path="*" element={<Login/>}/>

      </Routes>
    </div>
    </HashRouter>
  )
}

export default App