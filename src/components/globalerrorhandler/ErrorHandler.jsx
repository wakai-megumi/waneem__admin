import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import propTypes from 'prop-types';
const ErrorHandler = ({ error }) => {
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (error) {
            setShowError(true);
            toast.error("Server is down. Please try again later.");
        }
    }, [error]);

    if (showError) {
        return <div>Server is down. Please try again later.</div>;
    }

    return null;
};

export default ErrorHandler;

ErrorHandler.propTypes = {
    error: propTypes.object.isRequired,
};
