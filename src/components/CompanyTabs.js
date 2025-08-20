import React, { useState } from 'react';
import './CompanyTabs.css';

// Tab content components
const PostNewJob = () => (
  <div className="tab-content">
    <h3>Post New Job</h3>
    {/* Job posting form will go here */}
    <form className="job-post-form">
      <div className="form-group">
        <label>Job Title</label>
        <input type="text" placeholder="Enter job title" />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea rows="4" placeholder="Enter job description"></textarea>
      </div>
      <div className="form-group">
        <label>Requirements</label>
        <textarea rows="4" placeholder="Enter job requirements"></textarea>
      </div>
      <button type="submit" className="submit-button">Post Job</button>
    </form>
  </div>
);

const CurrentPostings = () => (
  <div className="tab-content">
    <h3>Current Job Postings</h3>
    <div className="job-listings">
      {/* Job listings will be mapped here */}
      <div className="no-jobs-message">
        No active job postings yet
      </div>
    </div>
  </div>
);

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

  const tabs = [
    { id: 'postJob', label: 'Post New Job', icon: 'fas fa-plus-circle' },
    { id: 'currentPosts', label: 'Current Postings', icon: 'fas fa-list-alt' },
    { id: 'employees', label: 'Employees', icon: 'fas fa-users' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'postJob':
        return <PostNewJob />;
      case 'currentPosts':
        return <CurrentPostings />;
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
