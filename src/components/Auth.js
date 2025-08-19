import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const Auth = () => {
  const handleSuccess = (credentialResponse) => {
    // You can send credentialResponse.credential to your backend for verification
    console.log("Google login success:", credentialResponse);
  };

  const handleError = () => {
    console.log("Google login failed");
  };

  return (
    <div>
      <h2>Sign in with Google</h2>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default Auth;
