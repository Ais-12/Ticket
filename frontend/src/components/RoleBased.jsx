import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

function RoleBased({ allowedRoles, children }) {
  const token = localStorage.getItem("access");
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);

    // Check if token expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem("access");
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles.includes(decoded.role)) {
      return children;
    }
    return <Navigate to="/unauthorized" replace />;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
}

export default RoleBased;

