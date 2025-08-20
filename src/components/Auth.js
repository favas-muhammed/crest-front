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
            "Accept": "application/json",
            "Authorization": `Bearer ${credentialResponse.credential}`
          },
          mode: "cors",
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
    <div className="auth-container" role="main" aria-labelledby="auth-title">
      <h2 id="auth-title">Sign in with Google</h2>
      <div
        className="login-button-container"
        role="form"
        aria-label="Google sign in form"
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          type="standard"
          theme="filled_blue"
          size="large"
          text="signin_with"
          shape="rectangular"
          locale="en"
          useOneTap={false}
        />
      </div>
    </div>
  );
};

export default Auth;
