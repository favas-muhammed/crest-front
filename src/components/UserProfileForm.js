import React, { useState, useEffect } from "react";
import "./UserProfileForm.css";

const UserProfileForm = ({ initialData, onSubmit, editMode = false }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    contactNumber: "",
    dateOfBirth: "",
    country: "",
    registerAs: "",
  });

  // Track whether fields have been successfully saved to determine if they should be locked
  const [savedFields, setSavedFields] = useState({
    firstName: false,
    lastName: false,
    dateOfBirth: false,
    registerAs: false,
  });

  useEffect(() => {
    if (initialData) {
      // Format the date to YYYY-MM-DD for the input
      const formattedDate = initialData.dateOfBirth
        ? new Date(initialData.dateOfBirth).toISOString().split("T")[0]
        : "";

      setFormData({
        ...initialData,
        dateOfBirth: formattedDate,
      });

      // Set saved fields based on whether they exist in initialData and have been submitted
      setSavedFields({
        firstName: !!initialData.firstName?.trim(),
        lastName: !!initialData.lastName?.trim(),
        dateOfBirth: !!initialData.dateOfBirth,
        // Lock registerAs if it has been submitted once
        registerAs: initialData.isProfileSubmitted && !!initialData.registerAs,
      });
    } else {
      // If no initial data, at least set the email from localStorage
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        setFormData((prev) => ({ ...prev, email: userEmail }));
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="user-profile-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="firstName">First Name*</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            disabled={editMode && savedFields.firstName}
          />
          {editMode && savedFields.firstName && (
            <small className="field-hint">
              First name cannot be changed once saved
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name*</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            disabled={editMode && savedFields.lastName}
          />
          {editMode && savedFields.lastName && (
            <small className="field-hint">
              Last name cannot be changed once saved
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email ID (Google Sign-in)</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || localStorage.getItem("userEmail") || ""}
            disabled
            className="disabled-input"
          />
          <small className="email-hint">
            This email is linked to your Google account and cannot be changed
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number* (Editable)</label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            className="editable-input"
          />
          {editMode && (
            <small className="field-hint success">
              You can update this field at any time
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth*</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            disabled={editMode && savedFields.dateOfBirth}
          />
          {editMode && savedFields.dateOfBirth && (
            <small className="field-hint">
              Date of birth cannot be changed once saved
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="country">Country* (Editable)</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="editable-input"
          />
          {editMode && (
            <small className="field-hint success">
              You can update this field at any time
            </small>
          )}
        </div>

        <div className="form-group full-width">
          <label htmlFor="address">Address* (Editable)</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows="3"
          />
        </div>

        <div className="form-group full-width">
          <label>
            Register As*{" "}
            {savedFields.registerAs && (
              <span className="locked-field">(Locked)</span>
            )}
          </label>
          <div className="register-as-options">
            <label className="radio-label">
              <input
                type="radio"
                name="registerAs"
                value="company"
                checked={formData.registerAs === "company"}
                onChange={handleChange}
                required
                disabled={savedFields.registerAs}
              />
              Company
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="registerAs"
                value="sales"
                checked={formData.registerAs === "sales"}
                onChange={handleChange}
                required
                disabled={savedFields.registerAs}
              />
              Sales Representative
            </label>
          </div>
          {savedFields.registerAs && (
            <small className="field-hint">
              Registration type cannot be changed after initial submission
            </small>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          {editMode ? "Save Changes" : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default UserProfileForm;
