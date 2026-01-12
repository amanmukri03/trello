import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/auth/register", form);
    navigate("/login");
  }
  return (
    <div className='container mt-5 d-flex justify-content-center align-items-center'>
      <div className="card p-4 shadow-sm" style={{ width: "400px" }}>
        <h3 className='text-center mb-3'>Register Account</h3>
        <form action="" onSubmit={handleSubmit}>
{/* Name filed */}

          <input type="text"
            className='form-control mb-2'
            placeholder='Enter your name...'
            onChange={handleChange}
            required
            name="name"
            id="" />
{/* Email filed */}

          <input type="email"
            className='form-control mb-2'
            placeholder='Enter your email...'
            onChange={handleChange}
            required
            name="email"
            id="" />
{/* Password filed */}

          <input type="password"
            className='form-control mb-2'
            placeholder='Enter your password...'
            onChange={handleChange}
            required
            name="password"
            id="" />

  {/* Options filed */}
            <select 
                  name="role" 
                  id=""
                  className='form-control mb-3'
                  onChange={handleChange}
                  ><option value="member">Member</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                  </select>

                  <button className='btn btn-success w-100'>Register</button>
        </form>
      </div>

    </div>
  )
}

export default Register