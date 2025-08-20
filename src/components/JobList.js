import React, { useState, useEffect } from "react";
import axios from "axios";
import "./JobList.css";

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const PublicJobCard = ({ job, onApply, currentUserId }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isJobOwner =
    currentUserId && job.postedBy && currentUserId === job.postedBy;

  return (
    <div className="public-job-card">
      <div className="job-card-header">
        <h3>{job.title}</h3>
        {!isJobOwner && (
          <button className="apply-button" onClick={() => onApply(job)}>
            Apply Now
          </button>
        )}
        {isJobOwner && <span className="owner-badge">Your Post</span>}
      </div>
      <div className="job-card-meta">
        <span className="company-name">
          {job.company?.firstName || "Company"}
        </span>
        <span className="location">{job.location}</span>
        <span className="salary">{job.salary}</span>
        <span className="posted-date">
          Posted on {formatDate(job.createdAt)}
        </span>
      </div>
      <div className="job-card-content">
        <div className="section">
          <h4>Description</h4>
          <p>{job.description}</p>
        </div>
        <div className="section">
          <h4>Requirements</h4>
          <p>{job.requirements}</p>
        </div>
      </div>
    </div>
  );
};

const JobApplicationModal = ({ job, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    coverLetter: "",
    resume: null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formPayload = new FormData();
    formPayload.append("coverLetter", formData.coverLetter);
    if (formData.resume) {
      formPayload.append("resume", formData.resume);
    }

    try {
      await onSubmit(formPayload);
      onClose();
    } catch (error) {
      console.error("Application submission failed:", error);
      alert(error.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Apply for {job.title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cover Letter*</label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  coverLetter: e.target.value,
                }))
              }
              rows="6"
              required
              placeholder="Tell us why you're perfect for this role..."
            ></textarea>
          </div>
          <div className="form-group">
            <label>Resume/CV* (PDF only)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, resume: e.target.files[0] }))
              }
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch current user's ID when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api
        .get(`${process.env.REACT_APP_API_URL}/api/users/me`)
        .then((response) => {
          setCurrentUserId(response.data._id);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      console.log("Fetching jobs from API...");
      const response = await api.get(
        `${process.env.REACT_APP_API_URL}/api/jobs`
      );
      console.log("API response:", response.data);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleApplicationSubmit = async (formData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to apply for jobs");
      return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await api.post(`/api/jobs/${selectedJob._id}/apply`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Application submitted successfully!");
    setShowModal(false);
  };

  if (loading) {
    return <div className="loading">Loading jobs...</div>;
  }

  return (
    <div className="job-list-container">
      <h2>Available Positions</h2>
      <div className="job-list">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <PublicJobCard
              key={job._id}
              job={job}
              onApply={handleApply}
              currentUserId={currentUserId}
            />
          ))
        ) : (
          <div className="no-jobs-message">
            No job postings available at the moment
          </div>
        )}
      </div>

      {showModal && selectedJob && (
        <JobApplicationModal
          job={selectedJob}
          onClose={() => setShowModal(false)}
          onSubmit={handleApplicationSubmit}
        />
      )}
    </div>
  );
};

export default JobList;
