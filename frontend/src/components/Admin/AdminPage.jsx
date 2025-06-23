import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const API_URL = "http://127.0.0.1:8000/api/movies/";

function AdminPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMovie, setEditMovie] = useState(null);
  const [form, setForm] = useState({
    name: "",
    rating: "",
    description: "",
    category: "",
    poster: "",
    released_date: "",
    theater: "",
    location: "",
    actors: [],
    languages: [],
    type: [],
  });

  const [actorsList, setActorsList] = useState([]);
  const [languagesList, setLanguagesList] = useState([]);
  const [typesList, setTypesList] = useState([]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteMovieName, setDeleteMovieName] = useState("");

  // Fetch all movies and extract unique actors/languages/types
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    setLoading(true);
    axios
      .get(API_URL)
      .then((res) => {
        const moviesData = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
        setMovies(moviesData);
        setLoading(false);

        // Extract unique actors, languages, and types (works for both objects & IDs)
        const actorsSet = new Map();
        const languagesSet = new Map();
        const typesSet = new Map();

        moviesData.forEach((movie) => {
          (movie.actors || []).forEach((a) => {
            if (typeof a === "object" && a !== null && a.name) {
              actorsSet.set(a.id, a.name);
            } else if (typeof a === "number" && !actorsSet.has(a)) {
              actorsSet.set(a, "Unknown Actor " + a);
            }
          });
          (movie.languages || []).forEach((l) => {
            if (typeof l === "object" && l !== null && l.name) {
              languagesSet.set(l.id, l.name);
            } else if (typeof l === "number" && !languagesSet.has(l)) {
              languagesSet.set(l, "Unknown Language " + l);
            }
          });
          (movie.type || []).forEach((t) => {
            if (typeof t === "object" && t !== null && t.name) {
              typesSet.set(t.id, t.name);
            } else if (typeof t === "number" && !typesSet.has(t)) {
              typesSet.set(t, "Unknown Type " + t);
            }
          });
        });

        setActorsList(Array.from(actorsSet, ([id, name]) => ({ id, name })));
        setLanguagesList(
          Array.from(languagesSet, ([id, name]) => ({ id, name }))
        );
        setTypesList(Array.from(typesSet, ([id, name]) => ({ id, name })));
      })
      .catch(() => {
        toast.error("Error fetching movies");
        setLoading(false);
      });
  };

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Open form for add or edit
  const openForm = (movie = null) => {
    if (movie) {
      setForm({
        ...movie,
        actors: (movie.actors || []).map((a) =>
          typeof a === "object" && a !== null ? a.id : a
        ),
        languages: (movie.languages || []).map((l) =>
          typeof l === "object" && l !== null ? l.id : l
        ),
        type: (movie.type || []).map((t) =>
          typeof t === "object" && t !== null ? t.id : t
        ),
      });
      setEditMovie(movie.id);
    } else {
      setForm({
        name: "",
        rating: "",
        description: "",
        category: "",
        poster: "",
        released_date: "",
        theater: "",
        location: "",
        actors: [],
        languages: [],
        type: [],
      });
      setEditMovie(null);
    }
    setShowForm(true);
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    setEditMovie(null);
  };

  // Submit form (add or update)
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // For actors, languages, type use *_ids
        let fieldKey = key;
        if (key === "actors") fieldKey = "actor_ids";
        if (key === "languages") fieldKey = "language_ids";
        if (key === "type") fieldKey = "type_ids";
        value.forEach((v) => formData.append(fieldKey, v));
      } else if (key === "poster" && value instanceof File) {
        formData.append(key, value);
      } else if (key !== "poster") {
        formData.append(key, value);
      }
    });

    const request = editMovie
      ? axios.put(`${API_URL}${editMovie}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      : axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

    request
      .then(() => {
        fetchMovies();
        closeForm();
        toast.success(
          `Movie ${editMovie ? "updated" : "added"} successfully!`,
          { autoClose: 2000 }
        );
      })
      .catch((error) => {
        console.error(
          "Error adding/updating movie:",
          error.response?.data || error.message || error
        );
        toast.error("Error adding/updating movie");
      });
  };

  const actorOptions = actorsList.map((actor) => ({
    value: actor.id,
    label: actor.name,
  }));
  const languageOptions = languagesList.map((language) => ({
    value: language.id,
    label: language.name,
  }));
  const typeOptions = typesList.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  // Delete movie
  const handleConfirmDelete = () => {
    axios
      .delete(`${API_URL}${deleteId}/`)
      .then(() => {
        fetchMovies();
        toast.success(
          `Movie '${deleteMovieName}' is deleted successfully!`,
          { autoClose: 2000 }
        );
        setShowConfirm(false);
        setDeleteId(null);
        setDeleteMovieName("");
      })
      .catch(() => {
        toast.error("Error deleting movie");
        setShowConfirm(false);
        setDeleteId(null);
        setDeleteMovieName("");
      });
  };

  // Helper to get name from ID
  const getNameById = (list, id) => {
    const found = list.find((item) => item.id === id);
    return found ? found.name : id;
  };

  // Render
  return (
    <div className="container mt-5">
      <ToastContainer position="bottom-right" />
      <h2 className="mb-4">Admin : Movie Management</h2>
      <button
        className="btn btn-success mb-3"
        onClick={() => openForm()}
      >
        Add Movie
      </button>

      {/* Movie Form Modal */}
      {showForm && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editMovie ? "Edit Movie" : "Add Movie"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeForm}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Name</label>
                    <input
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Rating</label>
                    <input
                      className="form-control"
                      name="rating"
                      type="number"
                      step="0.1"
                      value={form.rating}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Category</label>
                    <input
                      className="form-control"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Poster</label>
                    <input
                      className="form-control"
                      name="poster"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setForm({ ...form, poster: e.target.files[0] })
                      }
                      required={!editMovie}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Released Date</label>
                    <input
                      className="form-control"
                      name="released_date"
                      type="date"
                      value={form.released_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* Multi-selects */}
                  <div className="mb-2">
                    <label className="form-label">Actors</label>
                    <Select
                      isMulti
                      name="actors"
                      options={actorOptions}
                      value={actorOptions.filter((opt) =>
                        form.actors.includes(opt.value)
                      )}
                      onChange={(selected) =>
                        setForm({
                          ...form,
                          actors: selected ? selected.map((opt) => opt.value) : [],
                        })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Languages</label>
                    <Select
                      isMulti
                      name="languages"
                      options={languageOptions}
                      value={languageOptions.filter((opt) =>
                        form.languages.includes(opt.value)
                      )}
                      onChange={(selected) =>
                        setForm({
                          ...form,
                          languages: selected
                            ? selected.map((opt) => opt.value)
                            : [],
                        })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Type</label>
                    <Select
                      isMulti
                      name="type"
                      options={typeOptions}
                      value={typeOptions.filter((opt) =>
                        form.type.includes(opt.value)
                      )}
                      onChange={(selected) =>
                        setForm({
                          ...form,
                          type: selected ? selected.map((opt) => opt.value) : [],
                        })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeForm}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    {editMovie ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Delete Modal */}
      {showConfirm && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this movie?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movie Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Poster</th>
                <th>Name</th>
                <th>Rating</th>
                <th>Category</th>
                <th>Released</th>
                <th>Actors</th>
                <th>Languages</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id}>
                  <td>{movie.id}</td>
                  <td>
                    {movie.poster && (
                      <img
                        src={movie.poster}
                        alt={movie.name}
                        style={{
                          width: "60px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </td>
                  <td>{movie.name}</td>
                  <td>{movie.rating}</td>
                  <td>{movie.category}</td>
                  <td>{movie.released_date}</td>
                  {/* Actors */}
                  <td>
                    {Array.isArray(movie.actors)
                      ? movie.actors
                          .map((a) => {
                            if (
                              typeof a === "object" &&
                              a !== null &&
                              a.name
                            )
                              return a.name;
                            return getNameById(actorsList, a);
                          })
                          .join(", ")
                      : ""}
                  </td>
                  {/* Languages */}
                  <td>
                    {Array.isArray(movie.languages)
                      ? movie.languages
                          .map((l) => {
                            if (
                              typeof l === "object" &&
                              l !== null &&
                              l.name
                            )
                              return l.name;
                            return getNameById(languagesList, l);
                          })
                          .join(", ")
                      : ""}
                  </td>
                  {/* Type */}
                  <td>
                    {Array.isArray(movie.type)
                      ? movie.type
                          .map((t) => {
                            if (
                              typeof t === "object" &&
                              t !== null &&
                              t.name
                            )
                              return t.name;
                            return getNameById(typesList, t);
                          })
                          .join(", ")
                      : ""}
                  </td>
                  <td>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Movie actions"
                    >
                      <button
                        className="btn btn-outline-success btn-sm"
                        title="Edit"
                        onClick={() => openForm(movie)}
                      >
                        <i className="bi bi-pencil-square"></i> Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        title="Delete"
                        onClick={() => {
                          setDeleteId(movie.id);
                          setDeleteMovieName(movie.name);
                          setShowConfirm(true);
                        }}
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

export default AdminPage;
