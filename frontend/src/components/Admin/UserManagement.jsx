import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper to capitalize or show N/A
function displayValue(val) {
  return typeof val === "string" && val.length > 0
    ? val.charAt(0).toUpperCase() + val.slice(1)
    : <span className="text-muted">N/A</span>;
}

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleteUsername, setDeleteUsername] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      setError("No token found. Please login again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (Array.isArray(res.data)) setUsers(res.data);
        else if (Array.isArray(res.data.results)) setUsers(res.data.results);
        else setUsers([]);
        setError("");
      })
      .catch(() => {
        setUsers([]);
        setError("You are not authorized or not logged in!");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const openDeleteModal = (id, username) => {
    setDeleteId(id);
    setDeleteUsername(username);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/users/${deleteId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setUsers(users.filter((u) => u.id !== deleteId));
        toast.success(`User "${deleteUsername}" deleted successfully!`);
      })
      .catch(() => toast.error("Delete failed!"))
      .finally(() => {
        setShowDeleteModal(false);
        setDeleteId(null);
        setDeleteUsername("");
      });
  };

  const role = localStorage.getItem("role");
  useEffect(() => {
    if (role !== "admin") {
      alert("You are not authorized to view this page.");
      navigate("/");
    }
  }, [role, navigate]);

  return (
    <Container className="py-4">
      <ToastContainer position="bottom-right" />
      <h2 className="mb-4">User Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : users.length === 0 ? (
        <Alert variant="info">No users found.</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Gender</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={u.id}>
                <td>{idx + 1}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.mobile || <span className="text-muted">N/A</span>}</td>
                <td>{displayValue(u.gender)}</td>
                <td>
                  {typeof u.role === "string" && u.role.length > 0 ? (
                    <span
                      className={
                        u.role === "admin"
                          ? "badge bg-success"
                          : "badge bg-primary"
                      }
                    >
                      {displayValue(u.role)}
                    </span>
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => openDeleteModal(u.id, u.username)}
                    disabled={u.role === "admin"}
                    title={
                      u.role === "admin"
                        ? "Cannot delete admin user"
                        : "Delete user"
                    }
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to permanently delete user <strong>{deleteUsername}</strong>?
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export default UserManagement;
