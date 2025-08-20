import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const Auth = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      console.log("Google login success:", credentialResponse);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/google/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            credential: credentialResponse.credential,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const data = await response.json();
      // Store the token and user data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);
      window.location.href = "/"; // Redirect to home page after successful login
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Failed to authenticate with Google");
    }
  };

  const handleError = () => {
    console.error("Google login failed");
    alert("Google login failed. Please try again.");
  };

  return (
    <div>
      <h2>Sign in with Google</h2>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default Auth;
