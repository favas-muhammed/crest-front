import React from 'react';
import { Link } from 'react-router-dom';
import './CompanyNavBar.css';

const CompanyNavBar = () => {
  return (
    <div className="company-nav-bar">
      <Link to="/post-job" className="nav-item">
        <i className="fas fa-plus-circle"></i>
        Post New Job
      </Link>
      <Link to="/job-postings" className="nav-item">
        <i className="fas fa-list-alt"></i>
        Current Postings
      </Link>
      <Link to="/employees" className="nav-item">
        <i className="fas fa-users"></i>
        Employees
      </Link>
    </div>
  );
};

export default CompanyNavBar;
