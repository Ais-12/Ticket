import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TheaterManagement() {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", location: "" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchTheaters = () => {
    setLoading(true);
    axios.get("http://127.0.0.1:8000/api/theater/")
      .then(res => {
        setTheaters(Array.isArray(res.data) ? res.data : res.data.results || []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to fetch theaters");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  // Add
  const handleAdd = (e) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:8000/api/theater/", form)
      .then(() => {
        setForm({ name: "", location: "" });
        fetchTheaters();
        toast.success("Theater added successfully!");
      })
      .catch(() => toast.error("Failed to add theater"));
  };

  // Edit
  const openEdit = (theater) => {
    setForm({ name: theater.name, location: theater.location });
    setEditId(theater.id);
    setShowEditModal(true);
  };
  const handleEdit = (e) => {
    e.preventDefault();
    axios.put(`http://127.0.0.1:8000/api/theater/${editId}/`, form)
      .then(() => {
        setShowEditModal(false);
        setEditId(null);
        setForm({ name: "", location: "" });
        fetchTheaters();
        toast.success("Theater updated successfully!");
      })
      .catch(() => toast.error("Failed to update theater"));
  };

  // Delete
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };
  const handleDelete = () => {
    axios.delete(`http://127.0.0.1:8000/api/theater/${deleteId}/`)
      .then(() => {
        setShowDeleteConfirm(false);
        setDeleteId(null);
        fetchTheaters();
        toast.success("Theater deleted successfully!");
      })
      .catch(() => toast.error("Failed to delete theater"));
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="bottom-right" />
      <h2 className="mb-4">Admin : Theater Management</h2>
      {/* Add Theater Form */}
      <form className="mb-4" onSubmit={handleAdd}>
        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Location</label>
            <input
              className="form-control"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-success" type="submit">Add Theater</button>
          </div>
        </div>
      </form>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleEdit}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Theater</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Name</label>
                    <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Location</label>
                    <input className="form-control" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(false)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this theater?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theater Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {theaters.map(theater => (
                <tr key={theater.id}>
                  <td>{theater.id}</td>
                  <td>{theater.name}</td>
                  <td>{theater.location}</td>
                  <td>
                    <div className="btn-group" role="group" aria-label="Theater actions">
                      <button
                        className="btn btn-outline-success btn-sm"
                        title="Edit"
                        onClick={() => openEdit(theater)}
                      >
                        <i className="bi bi-pencil-square"></i> Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        title="Delete"
                        onClick={() => confirmDelete(theater.id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TheaterManagement;
