import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Totalbooking.scss';
import BookingCard from '../bookingcard/BookingCard';
import { toast } from 'react-toastify';

const TotalBookings = () => {
    const [bookingCount, setBookingCount] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [latestBookings, setLatestBookings] = useState([]);
    const [showPendingBookings, setShowPendingBookings] = useState(false);
    const [bookingGallery, setBookingGallery] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);


    useEffect(() => {
        getLatestBookings();
    }, [bookingCount]);

    const fetchBookings = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/booking/all-bookings`);

            if (response.data.success && response?.data?.bookings?.length > 0) {
                setBookingCount(response.data.length);
                setBookings(response.data.bookings);

            }
            else {
                setBookingCount(response.data.length);

            }



        } catch (error) {
            console.error('Error fetching booking count:', error);
        }
    };

    const getLatestBookings = () => {

        const data = bookings?.slice(0, 3);
        setLatestBookings(data);
    };

    const handleTogglePendingBookings = () => {
        setShowPendingBookings(!showPendingBookings);
    };

    const getPendingBookings = async () => {
        const pending_booking = bookings.filter((booking) => booking.status.toLowerCase() === 'pending');
        setBookingGallery(pending_booking);
    };

    useEffect(() => {
        if (showPendingBookings) {
            getPendingBookings();
        } else {
            setBookingGallery([]);
        }
    }, [showPendingBookings]);

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
            <h2>Booking Count: {bookingCount}</h2>

            <button className="toggle-button" onClick={handleTogglePendingBookings}>
                {showPendingBookings ? 'Show All Bookings' : 'Show Pending Bookings'}
            </button>

            {showPendingBookings && (
                <div className="booking-gallery">
                    <h3>Pending Bookings</h3>
                    <div className="gallery-container">
                        {
                            bookingGallery.length === 0 && <p>No pending bookings</p>
                        }
                        {bookingGallery.map((booking) => (
                            <BookingCard key={booking._id} booking={booking} handleStatus={handleStatus} handleRemoveBooking={handleRemoveBooking} />
                        ))}
                    </div>
                </div>
            )}

            <div className="latest-bookings">
                <h3>Latest Bookings</h3>
                {latestBookings?.map((booking) => (
                    <div className="booking-card" key={booking?._id}>
                        {booking?.hotelname && <p>Hotel: {booking.hotelname}</p>}

                        <p>Booking ID: {booking._id}</p>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default TotalBookings;
