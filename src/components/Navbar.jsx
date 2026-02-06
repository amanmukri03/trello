import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-gradient shadow-sm" style={{background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <span style={{fontSize:'35px'}}>Trello </span>
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav" style={{fontSize:'18px'}}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {isAuthenticated && (
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive("/dashboard")}`} 
                  to="/dashboard"
                >
                   Dashboard
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive("/about")}`} 
                to="/about"
              >
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive("/contact")}`} 
                to="/contact"
              >
                Contact
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center ms-3">
            {!isAuthenticated ? (
              <>
                <Link 
                  className="btn btn-outline-light me-2" 
                  to="/login"
                >
                  Login
                </Link>
                <Link 
                  className="btn btn-light text-primary fw-semibold" 
                  to="/register"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <div className="dropdown">
                  <button 
                    className="btn btn-outline-light dropdown-toggle" 
                    type="button" 
                    id="userDropdown" 
                    data-bs-toggle="dropdown"
                  >
                    <span className="me-1">👤</span>
                    {user?.name || user?.email}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <span className="dropdown-item-text">
                        <small className="text-muted">Role:</small>
                        <br />
                        <strong>{user?.role || "User"}</strong>
                      </span>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link className="dropdown-item" to="/dashboard">
                        Dashboard
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;