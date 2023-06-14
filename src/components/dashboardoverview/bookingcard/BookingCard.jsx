import React, { useState } from 'react';
import './BookingCard.scss';
import PropTypes from 'prop-types';

const BookingCard = ({ booking, handleStatus, handleRemoveBooking }) => {
    const [expanded, setExpanded] = useState(false);
    const { _id, checkInDate, checkOutDate, guests, status, user } = booking;

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const checkin = new Date(checkInDate).toLocaleDateString()
    const checkout = new Date(checkOutDate).toLocaleDateString()
    const startDate = new Date(checkInDate).getTime();
    const endDate = new Date(checkOutDate).getTime();

    const handleRemoveBooking__if_status_cancelled_already = () => {
        const dates = getDates(checkInDate, checkOutDate)
        handleRemoveBooking(_id, status, dates);
    };
    const getDates = (checkInDate, checkOutDate) => {
        let dates = []
        const theDate = new Date(checkInDate)
        const enddate = new Date(checkOutDate)
        while (theDate < enddate) {
            dates = [...dates, new Date(theDate)?.getTime()]
            theDate.setDate(theDate?.getDate() + 1)
        }
        dates = [...dates, enddate.getTime()]
        return dates
    }

    return (
        <div className={`booking-card ${expanded ? 'expanded' : ''}`}>
            <button className="remove-button" onClick={handleRemoveBooking__if_status_cancelled_already}> X </button>
            <p className='id'>  Booking ID: {_id}</p>

            <button onClick={toggleExpand}>
                {expanded ? 'Hide Details' : 'Show Details'}
            </button>

            {expanded && (
                <div className="booking-details">
                    <div className="details-card">
                        {booking?.hotelname && < p > Hotel: {booking?.hotelname}</p>}

                        <p>Check-in Date: {checkin}</p>
                        <p>Check-out Date: {checkout}</p>
                        <p>Guests: {guests}</p>
                        <p>User: {user}</p>
                        <p>Status: {status}</p>

                    </div>
                </div>
            )
            }

            <div className="action-buttons">
                {status === 'Pending' && (
                    <>
                        <button onClick={() => handleStatus(_id, 'approve', startDate, endDate)}>Approve</button>
                        <button onClick={() => handleStatus(_id, 'disapprove', startDate, endDate)}>Disapprove</button>
                    </>
                )}
            </div>
        </div >
    );
};

BookingCard.propTypes = {
    booking: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        hotelname: PropTypes.string.isRequired,
        checkInDate: PropTypes.string.isRequired,
        checkOutDate: PropTypes.string.isRequired,
        guests: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        user: PropTypes.string.isRequired,
    }).isRequired,
    handleStatus: PropTypes.func.isRequired,
    handleRemoveBooking: PropTypes.func.isRequired,
};

export default BookingCard;
