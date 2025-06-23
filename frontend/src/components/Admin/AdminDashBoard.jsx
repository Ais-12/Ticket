import React from "react";
import { Link } from "react-router-dom";

function AdminDashboard({ adminInfo }) {
  return (
    <div className="container py-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <div className="row g-4">
        {/* Row 1 */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h4 className="card-title">Movie Management</h4>
              <p className="card-text">Add, edit, or delete movies in the database.</p>
              <Link to="/admin/movies" className="btn btn-success">Go to Movies</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h4 className="card-title">Theater Management</h4>
              <p className="card-text">Manage theaters and their details.</p>
              <Link to="/admin/theaters" className="btn btn-success">Go to Theaters</Link>
            </div>
          </div>
        </div>
        {/* Row 2 */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h4 className="card-title">Show Management</h4>
              <p className="card-text">Manage show timings and assignments.</p>
              <Link to="/admin/shows" className="btn btn-success">Go to Shows</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h4 className="card-title">User Management</h4>
              <p className="card-text">View, add, edit, or delete users.</p>
              <Link to="/admin/users" className="btn btn-success">Go to Users</Link>
            </div>
          </div>
        </div>
        {/* Row 3: User Queries */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h4 className="card-title">User Queries</h4>
              <p className="card-text">View all contact form submissions from users.</p>
              <Link to="/admin/contact-queries" className="btn btn-success">View Queries</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
