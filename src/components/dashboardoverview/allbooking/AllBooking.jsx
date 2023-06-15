import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllBooking.scss';
import BookingCard from '../bookingcard/BookingCard';
import { toast } from 'react-toastify';

const TotalBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [showAllBookings, setShowAllBookings] = useState(false);
    const [bookingGallery, setBookingGallery] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);


    const fetchBookings = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/booking/all-bookings`);
            setBookings(response.data.bookings);



        } catch (error) {
            console.error('Error fetching booking count:', error);
        }
    };



    const handleToggleAllBookings = () => {
        setShowAllBookings(!showAllBookings);
    };



    const handleStatus = async (id, status, startDate, endDate) => {
        console.log(id, status, startDate, endDate)
        if (status == 'approve') status = 'Approved';
        else status = 'Cancelled';

        try {
            const response = await axios.patch(`${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/booking/update_booking_status`, { id, status, startDate, endDate }, {
                withCredentials: true,
                httpOnly: true,
            });


            const newData = bookings.filter((booking) => booking._id !== id);
            setBookings(newData);
        }
        catch (error) {
            console.error('Error updating booking status:', error);

        }



    }
    const handleRemoveBooking = async (id, status, dates) => {
        if (status === 'Cancelled') {

            try {
                const res = await axios.delete(`${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/booking/delete/`, {

                    headers: {
                        'data': JSON.stringify({
                            id: id,
                            dates: dates
                        })
                    }
                }, {
                    withCredentials: true,
                    httpOnly: true,
                });
                console.log(res)
            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            toast.error('Booking is in either pending or approved state.  Cannot be deleted.')
        }

    }
    return (
        <div className="total-bookings">

            <button className="toggle-button" onClick={handleToggleAllBookings}>
                {!showAllBookings ? 'Show All Bookings' : 'Hide Bookings'}
            </button>

            {showAllBookings && (
                <div className="booking-gallery">
                    <h3>All Bookings</h3>
                    <div className="gallery-container">
                        {bookings.map((booking) => (
                            <BookingCard key={booking._id} booking={booking} handleStatus={handleStatus} handleRemoveBooking={handleRemoveBooking} />
                        ))}
                    </div>
                </div>
            )}


        </div >
    );
};

export default TotalBookings;
