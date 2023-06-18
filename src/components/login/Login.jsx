import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.scss';
import { Authcontext } from '../../context/Authcontext';
import axios from "axios"
import Spinner from '../../utils/spinner/Spinner';
const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const navigate = useNavigate();
    const { currentUser, loading, error, dispatch } = useContext(Authcontext)



    const handleInputChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" })
        try {
            const { email, password } = credentials
            const res = await axios.post(`${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/auth/login`, {
                email: email,
                password: password,
            },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            // const cookieValue = document.cookie
            //     .split(';')
            //     .map(cookie => cookie.trim())
            //     .find(cookie => cookie.startsWith('access_token='))
            //     ?.split('=')[1];

            if (res?.data?.user?.isAdmin) {
                dispatch({ type: "LOGIN_SUCCESS", payload: { user: res?.data?.user } })

                navigate('/');
            }
            else {
                dispatch({ type: "LOGIN_FAILURE", payload: { message: "You are not admin" } })
            }

        } catch (err) {
            dispatch({ type: "LOGIN_FAILURE", payload: { message: err?.response?.data?.message } })


        }
    };
    return (
        <div className="login-container">
            <h2>Admin Login Portal</h2>

            {
                loading ? <Spinner /> : <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit" className='btn'>Login</button>
                    {
                        error ? <div className="error">{error.message}</div> : null
                    }
                    <a className="link" href="https://waneem.onrender.com" target="_blank" rel="noopener noreferrer" style={{ color: 'green', margin: '2rem 4.5rem' }}>Login as user</a>

                </form >
            }

        </div >
    );
};

export default Login