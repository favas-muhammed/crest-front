import React from "react";
import Auth from "../components/Auth";

const Home = () => {
  return (
    <div className="home-container">
      <div className="main-content">
        <h1>Welcome to the Home Page</h1>
        <p>This is the main landing page of the application.</p>
      </div>
      <div className="auth-section">
        <Auth />
      </div>
    </div>
  );
};

export default Home;
