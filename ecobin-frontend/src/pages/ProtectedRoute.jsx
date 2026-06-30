import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../api/auth';

// Wrap any route's element with this to require login.
// Usage: <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
export default function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}