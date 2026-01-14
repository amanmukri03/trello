import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">
        Daily Trello App 
      </Link>
      <div className="ms-auto">
        { !isAuthenticated ? (
            <>
                <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
                <Link className="btn btn-outline-light me-2" to="/register">Register</Link>
            </>
        ) : (
            <>
                <span className="text-white me-3">
                    Hi, { user?.name }
                </span>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </>
        )}
      </div>
    </nav>
  )
}
export default Navbar