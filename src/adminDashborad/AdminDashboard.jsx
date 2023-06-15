import React from 'react';
import './AdminDashboard.scss';
import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/header/Header';
import Content from '../components/content/Content';

const AdminDashboard = () => {
    return (
        <div className="container">
            <Header />
            <div className="admin-dashboard">
                <Sidebar />
                <div className="admin-dashboard__content">
                    <Content />
                </div>
            </div>
        </div>

    );
};

export default AdminDashboard;
