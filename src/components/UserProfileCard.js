import React from "react";
import "./UserProfileCard.css";

const UserProfileCard = ({ userData, onEdit, onDelete }) => {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <h2>
          {userData.firstName} {userData.lastName}
        </h2>
        <span className="profile-type">
          {userData.registerAs === "company"
            ? "Company"
            : "Sales Representative"}
        </span>
      </div>

      <div className="profile-info">
        <div className="info-group">
          <label>Email:</label>
          <span>{userData.email}</span>
        </div>

        <div className="info-group">
          <label>Date of Birth:</label>
          <span>
            {userData.dateOfBirth
              ? new Date(userData.dateOfBirth).toLocaleDateString()
              : "Not set"}
          </span>
        </div>

        <div className="info-group">
          <label>Contact:</label>
          <span>{userData.contactNumber || "Not set"}</span>
        </div>

        <div className="info-group">
          <label>Country:</label>
          <span>{userData.country || "Not set"}</span>
        </div>

        <div className="info-group full-width">
          <label>Address:</label>
          <span>{userData.address || "Not set"}</span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="edit-button" onClick={onEdit}>
          Edit Profile
        </button>
        <button className="delete-button" onClick={onDelete}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default UserProfileCard;
