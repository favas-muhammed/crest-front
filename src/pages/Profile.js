import React, { useState, useEffect } from "react";
import axios from "axios";
import UserProfileForm from "../components/UserProfileForm";
import UserProfileCard from "../components/UserProfileCard";
import CompanyTabs from "../components/CompanyTabs";
import "./Profile.css";

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL:
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_API_URL
      : process.env.REACT_APP_API_LOCAL_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies and auth headers
});

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // First get the email and token from localStorage
        const userEmail = localStorage.getItem("userEmail");
        const token = localStorage.getItem("token");

        if (!userEmail || !token) {
          throw new Error("Authentication required");
        }

        // Set token in axios headers
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          // Then fetch the profile data
          const response = await api.get("/api/profile");
          // Check if any required fields are empty
          const requiredFields = [
            "firstName",
            "lastName",
            "contactNumber",
            "dateOfBirth",
            "country",
            "address",
            "registerAs",
          ];
          const hasEmptyFields = requiredFields.some(
            (field) => !response.data[field]?.trim()
          );

          const profileWithEmail = {
            ...response.data,
            email: userEmail, // Ensure we're using the email from Google auth
          };
          setProfileData(profileWithEmail);

          // If profile exists but registerAs is missing, allow editing
          setIsEditing(hasEmptyFields || !response.data.registerAs);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // If profile doesn't exist, show the form with empty fields
            setProfileData({
              email: userEmail,
              firstName: "",
              lastName: "",
              address: "",
              contactNumber: "",
              dateOfBirth: "",
              country: "",
              registerAs: "",
            });
            setIsEditing(true); // Automatically show form for new users
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.message === "Authentication required") {
          window.location.href = "/";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmitProfile = async (formData) => {
    try {
      // Validate all fields are filled
      const requiredFields = [
        "firstName",
        "lastName",
        "contactNumber",
        "dateOfBirth",
        "country",
        "address",
        "registerAs",
      ];
      const emptyFields = requiredFields.filter((field) => {
        // Special handling for dateOfBirth since it's not a string
        if (field === "dateOfBirth") return !formData[field];
        return !formData[field]?.trim();
      });

      if (emptyFields.length > 0) {
        alert(`Please fill in all required fields: ${emptyFields.join(", ")}`);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (!["company", "sales"].includes(formData.registerAs)) {
        alert('Register As must be either "company" or "sales"');
        return;
      }

      // Format the date and prepare submission data
      const dataToSubmit = {
        ...formData,
        email: localStorage.getItem("userEmail"),
        dateOfBirth: formData.dateOfBirth, // Send the date as is from the form
      };

      console.log("Submitting profile data:", dataToSubmit);
      const response = await api.post("/api/profile", dataToSubmit);

      if (response.data) {
        setProfileData(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      if (error.message === "Authentication required") {
        window.location.href = "/";
      } else if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
        if (error.response.data.currentDate) {
          console.log("Current date in DB:", error.response.data.currentDate);
        }
      } else {
        alert(
          "Failed to save profile. Please ensure all fields are filled correctly."
        );
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = () => {
      return new Promise((resolve) => {
        const result = window.confirm(
          "Warning: This action will permanently delete your account and all associated data. " +
            "This cannot be undone. Are you sure you want to proceed?"
        );
        resolve(result);
      });
    };

    try {
      const confirmed = await confirmDelete();
      if (!confirmed) return;

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await api.delete("/api/users/delete-account");

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");

      // Show success message before redirect
      alert("Your account has been successfully deleted.");

      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-section">
        {profileData && !isEditing ? (
          <UserProfileCard
            userData={profileData}
            onEdit={handleEdit}
            onDelete={handleDeleteAccount}
          />
        ) : (
          <>
            <h2 className="profile-form-title">
              {profileData ? "Edit Profile" : "Complete Your Profile"}
            </h2>
            <UserProfileForm
              initialData={profileData}
              onSubmit={handleSubmitProfile}
              editMode={!!profileData}
            />
          </>
        )}
      </div>

      {/* Show CompanyTabs only if user is registered as a company and profile is complete */}
      {profileData && !isEditing && profileData.registerAs === "company" && (
        <CompanyTabs />
      )}
    </div>
  );
};

export default Profile;
