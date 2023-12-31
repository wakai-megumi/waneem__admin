import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Authcontext } from "../../context/Authcontext"

import './Header.scss';
import axios from 'axios';

const Header = () => {
    const { currentUser } = useContext(
        Authcontext);
    const navigate = useNavigate()

    const handlelogout = async () => {
        console.log(import.meta.env.VITE_REACT_SERVER_URL)
        await axios.get(`${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/auth/logout`, { withCredentials: true })
        localStorage.removeItem("currentUser")

        navigate('/login')
    }
    return (
        <header className="header">
            {currentUser && <>
                <div className="logo">
                    <Link to="/">Admin Panel</Link>
                </div>
                <nav className="navigation">
                    <ul className="nav-links">
                        <li>
                            <Link to="/admin-dashboard">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/admin-dashboard/hotels">Hotels</Link>
                        </li>
                        <li>
                            <Link to="/admin-dashboard/room">Rooms</Link>
                        </li>
                    </ul>
                </nav>
                <div className="user-profile">
                    {currentUser ?
                        (
                            <>
                                <span className="username">{currentUser.username}</span>
                                <img src={currentUser.profileimage} alt="User" onClick={() => navigate(`/admin-dashboard/profile`, { state: { user: currentUser } })} />
                                <button onClick={handlelogout}>Logout</button>
                            </>
                        ) : (
                            <Link className="link" to="/login">Login</Link>
                        )}
                </div></>}
        </header>
    );
};

export default Header;
