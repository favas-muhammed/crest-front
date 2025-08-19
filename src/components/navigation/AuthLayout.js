import React from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AuthLayout.css";

const AuthLayout = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-layout">
      <Sidebar />
      <main className="auth-layout-content">{children}</main>
    </div>
  );
};

export default AuthLayout;
