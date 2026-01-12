import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../store/authSlice'


const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await api.post("/auth/login", {
                email,
                password
            });

            dispatch(loginSuccess({
                user: res.data.user,
                token: res.data.token
            }));

            sessionStorage.setItem("token", res.data.token);
            sessionStorage.setItem("user", JSON.stringify(res.data.user));

            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        };
    };

    return (
        <div className='container mt-5 d-flex justify-content-center align-items-center' >
            <div className="card p-4 shadow-sm" style={{ width: '400px' }}>
                <h3 className="text-center mb-3">Login</h3>
                {error && <div className='alert alert-danger'>{error}</div>}
                <form action="" onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email">Email</label>
                        <input type="email"
                            className='form-control'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            name="email"
                            id="email" />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="password">Password</label>
                        <input type="password"
                            className='form-control'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            id="password" />
                    </div>
                    <button type="submit" className='btn btn-primary w-100'>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login