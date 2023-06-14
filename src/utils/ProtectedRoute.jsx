// ProtectedRoute.js
import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { Authcontext } from "../../src/context/Authcontext"

import propvalidation from "prop-types"
const ProtectedRoute = ({ children }) => {
    const { currentUser } = useContext(Authcontext);
    if (currentUser)
        return children;
    else
        return <Navigate to="/" />
};

export default ProtectedRoute;


ProtectedRoute.propTypes = {

    children: propvalidation.node.isRequired,


};
