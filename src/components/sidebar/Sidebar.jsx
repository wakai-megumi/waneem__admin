import React, { useContext, useState } from "react";
import "./Sidebar.scss";
import { Link, useNavigate } from "react-router-dom";
import { Authcontext } from "../../context/Authcontext";
import { toast } from "react-toastify";
const Sidebar = () => {
    const { currentUser } = useContext(Authcontext);
    const navigate = useNavigate()


    const handleupcomingfeature = () => {
        toast.info('this feature is still in development phase')
    }
    return (
        <div className="sidebar">
            <h2>Main Title</h2>
            <ul>
                <li><Link to="/admin-dashboard">Dashboard</Link></li>
            </ul>
            <h2>Lists</h2>
            <ul>
                <li><Link to="/admin-dashboard/users">Users</Link></li>
                <li><Link to="/admin-dashboard/hotels">Hotels</Link></li>
                <li><Link to="/admin-dashboard/room">Rooms</Link></li>
            </ul>
            <h2>Useful</h2>
            <ul>
                <li><Link onClick={handleupcomingfeature}>Stats</Link></li>
                <li><Link onClick={handleupcomingfeature}>Notifications</Link></li>
            </ul>
            <h2>Service</h2>
            <ul>
                <li><Link onClick={handleupcomingfeature}>Logs</Link></li>
                <li><Link onClick={handleupcomingfeature}>Settings</Link></li>
            </ul>
            <h2>User</h2>
            <ul>
                <li><button className="link" onClick={() => navigate('/admin-dashboard/profile', { state: { user: currentUser } })}> <p>Profile</p></button></li>
            </ul>
        </div >
    );
};

export default Sidebar;