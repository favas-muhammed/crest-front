import React, { useEffect, useState } from "react";
import Auth from "../components/Auth";
import Sidebar from "../components/navigation/Sidebar";
import "./Home.css";

const Home = () => {
  const [userName, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const token = localStorage.getItem("token");

    if (storedUserName && token) {
      setUserName(storedUserName);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="home-container">
      {isAuthenticated && <Sidebar />}
      <div className={`main-content ${isAuthenticated ? "with-sidebar" : ""}`}>
        {isAuthenticated ? (
          <div className="dashboard">
            <h1>Hey {userName}!</h1>
            <p>Welcome to your dashboard.</p>
          </div>
        ) : (
          <div className="login-content">
            <h1>crest.</h1>
            <div className="auth-section">
              <Auth />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
