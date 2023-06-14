import React from 'react';
import BookingCard from '../bookingcard/BookingCard.jsx';
import propTypes from 'prop-types';
import './BookingGallery.scss';
const BookingGallery = ({ bookings }) => {
    return (
        <div>
            <h2>Booking Gallery</h2>
            {bookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
            ))}
        </div>
    );
};

export default BookingGallery;

BookingGallery.propTypes = {
    bookings: propTypes.array.isRequired,
};
