// src/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, isLoggedIn }) => {
    return isLoggedIn ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
