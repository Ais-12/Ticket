import React, { useEffect, useState } from "react";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ShowManagement() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  // For add/edit form
  const [form, setForm] = useState({
    movie: null,
    theater: null,
    date: "",
    time: "",
    languages: ""
  });
  const [editId, setEditId] = useState(null); // null for add, id for edit
  const [showFormModal, setShowFormModal] = useState(false);

  // For delete confirmation
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // For dropdowns
  const [moviesList, setMoviesList] = useState([]);
  const [theatersList, setTheatersList] = useState([]);

  // Fetch shows
  const fetchShows = () => {
    setLoading(true);
    axios.get("http://127.0.0.1:8000/api/show/")
      .then(res => {
        setShows(Array.isArray(res.data) ? res.data : res.data.results || []);
        setLoading(false);
      }).catch(error => {
        toast.error("Failed to fetch shows");
        setLoading(false);
      });
  };

  // Fetch movies and theaters
  useEffect(() => {
    fetchShows();
    axios.get("http://127.0.0.1:8000/api/movies/")
      .then(res => {
        const arr = Array.isArray(res.data) ? res.data : res.data.results || [];
        setMoviesList(arr.map(m => ({ value: m.id, label: m.name })));
      });
    axios.get("http://127.0.0.1:8000/api/theater/")
      .then(res => {
        const arr = Array.isArray(res.data) ? res.data : res.data.results || [];
        setTheatersList(arr.map(t => ({ value: t.id, label: t.name })));
      });
  }, []);

  // Open modal for Add or Edit
  const openForm = (show = null) => {
    if (show) {
      setForm({
        movie: show.movie
          ? { value: show.movie.id || show.movie, label: show.movie.name || show.movie }
          : null,
        theater: show.theater
          ? { value: show.theater.id || show.theater, label: show.theater.name || show.theater }
          : null,
        date: show.date,
        time: show.time,
        languages: (show.languages || []).join(", ")
      });
      setEditId(show.id);
    } else {
      setForm({ movie: null, theater: null, date: "", time: "", languages: "" });
      setEditId(null);
    }
    setShowFormModal(true);
  };

  // Close modal
  const closeForm = () => {
    setShowFormModal(false);
    setEditId(null);
    setForm({ movie: null, theater: null, date: "", time: "", languages: "" });
  };

  // Add or Edit submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!form.movie || !form.theater) {
      toast.error("Please select both a movie and a theater.");
      return;
    }
    if (!form.date || !form.time || !form.languages) {
      toast.error("Please fill all fields.");
      return;
    }

    const data = {
      movie: form.movie.value,
      theater: form.theater.value,
      date: form.date,
      time: form.time,
      languages: form.languages.split(",").map(l => l.trim())
    };

    if (editId) {
      axios.put(`http://127.0.0.1:8000/api/show/${editId}/`, data)
        .then(() => {
          closeForm();
          fetchShows();
          toast.success("Show updated successfully!");
        })
        .catch(err => {
          toast.error("Update failed: " + (err.response?.data?.detail || err.message));
          console.error(err);
        });
    } else {
      axios.post("http://127.0.0.1:8000/api/show/", data)
        .then(() => {
          closeForm();
          fetchShows();
          toast.success("Show added successfully!");
        })
        .catch(err => {
          toast.error("Add failed: " + (err.response?.data?.detail || err.message));
          console.error(err);
        });
    }
  };

  // Delete Show
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };
  const handleDelete = () => {
    axios.delete(`http://127.0.0.1:8000/api/show/${deleteId}/`)
      .then(() => {
        setShowDeleteConfirm(false);
        setDeleteId(null);
        fetchShows();
        toast.success("Show deleted successfully!");
      })
      .catch(() => toast.error("Failed to delete show"));
  };

  // Creatable for Theater
  const handleCreateTheater = (inputValue) => {
    axios.post("http://127.0.0.1:8000/api/theater/", { name: inputValue, location: "" })
      .then(res => {
        const newTheater = { value: res.data.id, label: res.data.name };
        setTheatersList(prev => [...prev, newTheater]);
        setForm(f => ({ ...f, theater: newTheater }));
        toast.success("Theater created!");
      })
      .catch(() => toast.error("Failed to create theater"));
  };
  // Creatable for Movie
  const handleCreateMovie = (inputValue) => {
    axios.post("http://127.0.0.1:8000/api/movies/", { name: inputValue })
      .then(res => {
        const newMovie = { value: res.data.id, label: res.data.name };
        setMoviesList(prev => [...prev, newMovie]);
        setForm(f => ({ ...f, movie: newMovie }));
        toast.success("Movie created!");
      })
      .catch(() => toast.error("Failed to create movie"));
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="bottom-right" />
      <h2 className="mb-4">Admin : Show Management</h2>
      <button className="btn btn-success mb-3" onClick={() => openForm()}>Add Show</button>

      {/* Add/Edit Modal */}
      {showFormModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{editId ? "Edit Show" : "Add Show"}</h5>
                  <button type="button" className="btn-close" onClick={closeForm}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Movie</label>
                    <CreatableSelect
                      isClearable
                      onChange={selected => setForm(f => ({ ...f, movie: selected }))}
                      onCreateOption={handleCreateMovie}
                      options={moviesList}
                      value={form.movie}
                      placeholder="Select or type to add a movie"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Theater</label>
                    <CreatableSelect
                      isClearable
                      onChange={selected => setForm(f => ({ ...f, theater: selected }))}
                      onCreateOption={handleCreateTheater}
                      options={theatersList}
                      value={form.theater}
                      placeholder="Select or type to add a theater"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Date</label>
                    <input
                      className="form-control"
                      type="date"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Time</label>
                    <input
                      className="form-control"
                      type="time"
                      value={form.time}
                      onChange={e => setForm({ ...form, time: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Languages</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="e.g. Tamil, English"
                      value={form.languages}
                      onChange={e => setForm({ ...form, languages: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeForm}>Cancel</button>
                  <button type="submit" className="btn btn-success">{editId ? "Update" : "Add"}</button>
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
                Are you sure you want to delete this show?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Show Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Movie</th>
                <th>Theater</th>
                <th>Date</th>
                <th>Time</th>
                <th>Languages</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shows.map(show => (
                <tr key={show.id}>
                  <td>{show.id}</td>
                  <td>{show.movie_obj?.name || show.movie}</td>
                  <td>{show.theater_obj?.name || show.theater}</td>
                  <td>{show.date}</td>
                  <td>{show.time}</td>
                  <td>{(show.languages || []).join(", ")}</td>
                  <td>
                    <div className="btn-group" role="group" aria-label="Show actions">
                      <button
                        className="btn btn-outline-success btn-sm"
                        title="Edit"
                        onClick={() => openForm(show)}
                      >
                        <i className="bi bi-pencil-square"></i> Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        title="Delete"
                        onClick={() => confirmDelete(show.id)}
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

export default ShowManagement;
