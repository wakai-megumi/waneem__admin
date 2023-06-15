import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import { Authcontext } from '../../context/Authcontext';
import axios from "axios"
const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const [E, setE] = useState(true)
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
            const cookieValue = document.cookie
                .split(';')
                .map(cookie => cookie.trim())
                .find(cookie => cookie.startsWith('access_token='))
                ?.split('=')[1];

            console.log(cookieValue, "in login way ");
            console.log(res.headers, "in login setup");
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
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
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
                <span className='error'>{error && error?.message}</span>
            </form>
        </div>
    );
};

export default Login;
