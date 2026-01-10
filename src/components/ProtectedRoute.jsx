import React from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = () => {
    const {isAuthenticated} = useSelector(
        (state) => state.auth);

    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }
  return (
    <div>
        
    </div>
  )
}

export default ProtectedRoute 