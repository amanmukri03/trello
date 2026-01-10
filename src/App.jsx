import React from 'react'
import'./styles/global.css'
import {BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import Board from './pages/Board';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';


const App = () => {
  return (
    <BrowserRouter basename="/trello">
    <div className='app-container'>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
        <Route path="/board" element={<ProtectedRoute><Board/></ProtectedRoute>}/>
        <Route path="*" element={<Login/>}/>

      </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App