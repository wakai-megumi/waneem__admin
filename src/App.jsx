import React, { Profiler, useContext } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes, useNavigationType, useNavigate } from 'react-router-dom';
import { Authcontext } from './context/Authcontext.jsx';
import Login from '../src/components/login/Login';
import AdminDashboard from '../src/adminDashborad/AdminDashboard';
import Content from "../src/components/content/Content.jsx"
import DashboardOverview from "../src/components/dashboardoverview/DashboardOverview.jsx"
import Users from './components/users/Users.jsx';
import HotelsManagement from '../src/components/hotelmanage/HotelsManagement.jsx';
import RoomManagement from './components/roommanage/RoomManagement.jsx';
import AddUser from './components/adduser/AddUser.jsx';
import AddHotel from './components/addhotel/Addhotel.jsx';
import Addroom from './components/addroom/Addroom.jsx';
import UserProfile from './profile/Profile.jsx';
import { ToastContainer } from 'react-toastify';
import HotelProfile from './components/hotelProfile/HotelProfile.jsx';
import EditHotel from './components/hotelmanage/editHotel/EditHotel.jsx';
import { BsArrowLeft } from 'react-icons/bs'
import "./App.scss"


const App = () => {
  const { currentUser } = useContext(Authcontext);
  const isadmin = currentUser && currentUser.isAdmin;
  console.log(currentUser, currentUser?.isAdmin)
  const BackButton = () => {
    const navigate = useNavigate();

    const goBack = () => {
      navigate(-1);
    };

    return (
      <div className="back-button-container">
        <button className="back-button" onClick={goBack}>
          <BsArrowLeft />

        </button>
      </div>
    );
  };
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {isadmin ? (
          <>
            <Route path="/" element={<Navigate to="/admin-dashboard" />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />}>
              <Route path="/admin-dashboard" element={<DashboardOverview />} />
              <Route path="/admin-dashboard/users" element={<Users />} />


              <Route path={`/admin-dashboard/profile/`} element={<UserProfile />} />
              <Route path={`/admin-dashboard/hotel_profile/`} element={<HotelProfile />} />


              <Route path="/admin-dashboard/hotels" element={<HotelsManagement />} />
              <Route path="/admin-dashboard/hotel_profile/edithotel" element={<EditHotel />} />

              <Route path="/admin-dashboard/room" element={<RoomManagement />} />
              <Route path="/admin-dashboard/adduser/" element={<AddUser />} />
              <Route path="/admin-dashboard/addroom/" element={<Addroom />} />

              <Route path="/admin-dashboard/addhotel/" element={<AddHotel />} />
            </Route>
          </>
        ) : (
          <Route path="/" element={<Login />} />
        )}
      </Routes>
      <BackButton />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Router>
  );
};

export default App;
