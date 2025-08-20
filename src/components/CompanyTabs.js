import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CompanyTabs.css';

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

const PostNewJob = ({ onJobPosted }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await api.post('/api/jobs', formData);
      setFormData({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salary: ''
      });
      onJobPosted();
      alert('Job posted successfully!');
    } catch (error) {
      console.error('Error posting job:', error);
      alert(error.response?.data?.message || 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tab-content">
      <h3>Post New Job</h3>
      <form className="job-post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Job Title*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter job title"
            required
          />
        </div>
        <div className="form-group">
          <label>Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter job description"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Requirements*</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows="4"
            placeholder="Enter job requirements"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Location*</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter job location"
            required
          />
        </div>
        <div className="form-group">
          <label>Salary*</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Enter salary range"
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

const JobCard = ({ job, onDelete, onEdit }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3>{job.title}</h3>
        <div className="job-actions">
          <button className="edit-button" onClick={() => onEdit(job)}>
            <i className="fas fa-edit"></i> Edit
          </button>
          <button className="delete-button" onClick={() => onDelete(job._id)}>
            <i className="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
      <div className="job-card-content">
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Salary:</strong> {job.salary}</p>
        <p><strong>Posted:</strong> {formatDate(job.createdAt)}</p>
        <p><strong>Description:</strong> {job.description}</p>
        <p><strong>Requirements:</strong> {job.requirements}</p>
      </div>
    </div>
  );
};

const CurrentPostings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await api.get('/api/jobs/company-jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      alert('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        const token = localStorage.getItem('token');
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        await api.delete(`/api/jobs/${jobId}`);
        fetchJobs();
        alert('Job deleted successfully');
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job');
      }
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setShowEditForm(true);
  };

  const handleUpdateJob = async (updatedJob) => {
    try {
      const token = localStorage.getItem('token');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      await api.put(`/api/jobs/${editingJob._id}`, updatedJob);
      setShowEditForm(false);
      setEditingJob(null);
      fetchJobs();
      alert('Job updated successfully');
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Failed to update job');
    }
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditingJob(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (showEditForm && editingJob) {
    return (
      <div className="tab-content">
        <h3>Edit Job Posting</h3>
        <form className="job-post-form" onSubmit={(e) => {
          e.preventDefault();
          handleUpdateJob({
            title: e.target.title.value,
            description: e.target.description.value,
            requirements: e.target.requirements.value,
            location: e.target.location.value,
            salary: e.target.salary.value
          });
        }}>
          <div className="form-group">
            <label>Job Title*</label>
            <input
              type="text"
              name="title"
              defaultValue={editingJob.title}
              required
            />
          </div>
          <div className="form-group">
            <label>Description*</label>
            <textarea
              name="description"
              rows="4"
              defaultValue={editingJob.description}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Requirements*</label>
            <textarea
              name="requirements"
              rows="4"
              defaultValue={editingJob.requirements}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Location*</label>
            <input
              type="text"
              name="location"
              defaultValue={editingJob.location}
              required
            />
          </div>
          <div className="form-group">
            <label>Salary*</label>
            <input
              type="text"
              name="salary"
              defaultValue={editingJob.salary}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">Update Job</button>
            <button type="button" className="cancel-button" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <h3>Current Job Postings</h3>
      <div className="job-listings">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <JobCard
              key={job._id}
              job={job}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <div className="no-jobs-message">
            No active job postings yet
          </div>
        )}
      </div>
    </div>
  );
};

const Employees = () => (
  <div className="tab-content">
    <h3>Employees</h3>
    <div className="employees-list">
      {/* Employees list will be mapped here */}
      <div className="no-employees-message">
        No employees found
      </div>
    </div>
  </div>
);

const CompanyTabs = () => {
  const [activeTab, setActiveTab] = useState('postJob');
  const [jobsUpdated, setJobsUpdated] = useState(false);

  const tabs = [
    { id: 'postJob', label: 'Post New Job', icon: 'fas fa-plus-circle' },
    { id: 'currentPosts', label: 'Current Postings', icon: 'fas fa-list-alt' },
    { id: 'employees', label: 'Employees', icon: 'fas fa-users' }
  ];

  const handleJobPosted = () => {
    setJobsUpdated(prev => !prev);
    setActiveTab('currentPosts');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'postJob':
        return <PostNewJob onJobPosted={handleJobPosted} />;
      case 'currentPosts':
        return <CurrentPostings key={jobsUpdated} />;
      case 'employees':
        return <Employees />;
      default:
        return null;
    }
  };

  return (
    <div className="company-tabs-container">
      <div className="tabs-header">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={tab.icon}></i>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content-container">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CompanyTabs;
