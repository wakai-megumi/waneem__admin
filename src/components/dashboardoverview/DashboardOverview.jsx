import React from "react";
import TotalBookings from "./totalbookings/TotalBookings.jsx";
import AllBooking from "./allbooking/AllBooking.jsx";
import "./DashboardOverview.scss";
const DashboardOverview = () => {
    return (
        <div className="dashboard-overview">
            <TotalBookings />
            <AllBooking />
        </div>
    );
};

export default DashboardOverview;