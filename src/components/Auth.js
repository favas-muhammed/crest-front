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
          },
          body: JSON.stringify({
            credential: credentialResponse.credential,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const data = await response.json();
      // Store the token in localStorage or your preferred state management solution
      localStorage.setItem("token", data.token);
      window.location.href = "/profile"; // Redirect to profile page after successful login
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
