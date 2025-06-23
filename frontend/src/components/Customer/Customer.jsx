import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Customer.css";

const MOVIES_API = "http://127.0.0.1:8000/api/movies/";
const THEATER_API = "http://127.0.0.1:8000/api/theater/";
const SHOWS_API = "http://127.0.0.1:8000/api/show/";

function Customer({ searchQuery }) {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState({
    genre: "",
    language: "",
    location: ""
  });

  const [theaterMap, setTheaterMap] = useState({}); // id -> theater
  const [movieShowLanguages, setMovieShowLanguages] = useState({}); // movieId -> [languages]
  const [movieTheaterMap, setMovieTheaterMap] = useState({}); // movieId -> [theaterId]

  const navigate = useNavigate();

  // Fetch all data on mount
  useEffect(() => {
    // Fetch movies
    axios.get(MOVIES_API).then(res => {
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setMovies(data);
      setFilteredMovies(data);

      // Extract genres from movies
      setGenres([...new Set(data.map(m => m.category).filter(Boolean))]);
    });

    // Fetch theaters for locations
    axios.get(THEATER_API).then(res => {
      const theaters = Array.isArray(res.data) ? res.data : res.data.results || [];
      setLocations([...new Set(theaters.map(t => t.location).filter(Boolean))]);
      // Map for theater id lookup
      const tMap = {};
      theaters.forEach(t => { tMap[t.id] = t; });
      setTheaterMap(tMap);
    });

    // Fetch shows for languages and movie-theater mapping
    axios.get(SHOWS_API).then(res => {
      const shows = Array.isArray(res.data) ? res.data : res.data.results || [];
      // All unique languages
      const allLangs = new Set();
      // Map for movieId -> [languages]
      const showLangMap = {};
      // Map for movieId -> [theaterId]
      const mTheaterMap = {};
      shows.forEach(show => {
        const langs = show.languages || [];
        langs.forEach(l => allLangs.add(l));
        // Map languages to movie
        const movieId = show.movie && (show.movie.id || show.movie);
        if (movieId) {
          if (!showLangMap[movieId]) showLangMap[movieId] = new Set();
          langs.forEach(l => showLangMap[movieId].add(l));
        }
        // Map theaters to movie
        const theaterId = show.theater && (show.theater.id || show.theater);
        if (movieId && theaterId) {
          if (!mTheaterMap[movieId]) mTheaterMap[movieId] = new Set();
          mTheaterMap[movieId].add(theaterId);
        }
      });
      setLanguages([...allLangs]);
      // Convert sets to arrays
      const movieLangArrMap = {};
      Object.keys(showLangMap).forEach(mid => {
        movieLangArrMap[mid] = Array.from(showLangMap[mid]);
      });
      setMovieShowLanguages(movieLangArrMap);

      const movieTheaterArrMap = {};
      Object.keys(mTheaterMap).forEach(mid => {
        movieTheaterArrMap[mid] = Array.from(mTheaterMap[mid]);
      });
      setMovieTheaterMap(movieTheaterArrMap);
    });
  }, []);

  // Filter movies when filters or searchQuery changes
  useEffect(() => {
    let filtered = movies;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Genre filter
    if (filters.genre) {
      filtered = filtered.filter(m => m.category === filters.genre);
    }

    // Location filter (theater location)
    if (filters.location) {
      filtered = filtered.filter(movie => {
        return (movieTheaterMap[movie.id] || []).some(
          tid => theaterMap[tid] && theaterMap[tid].location === filters.location
        );
      });
    }

    // Language filter (from shows)
    if (filters.language) {
      filtered = filtered.filter(movie => {
        const langs = movieShowLanguages[movie.id] || [];
        return langs.includes(filters.language);
      });
    }

    setFilteredMovies(filtered);
  }, [filters, movies, searchQuery, theaterMap, movieShowLanguages, movieTheaterMap]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleBookTickets = (movie) => {
    navigate(`/book/${movie.id}`);
  };

  // Helper to get all unique locations for a movie
  const getMovieLocations = (movieId) => {
    if (!movieTheaterMap[movieId]) return "No Location";
    return movieTheaterMap[movieId]
      .map(theaterId => theaterMap[theaterId]?.location)
      .filter(Boolean)
      .filter((loc, idx, arr) => arr.indexOf(loc) === idx) // Unique locations
      .join(", ") || "No Location";
  };

  return (
    <div className="mt-4">
      <div className="row">
        {/* Left column: Filters */}
        <div className="container col-md-3 mb-4">
          <div className="card shadow filter-card">
            <div className="card-header bg-success text-white fw-bold d-flex align-items-center">
              <i className="bi bi-funnel-fill me-2"></i> Filter Movies
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-film me-1 text-primary"></i> Genre
                </label>
                <select className="form-select" name="genre" value={filters.genre} onChange={handleFilterChange}>
                  <option value="">All</option>
                  {genres.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-translate me-1 text-warning"></i> Language
                </label>
                <select className="form-select" name="language" value={filters.language} onChange={handleFilterChange}>
                  <option value="">All</option>
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label fw-semibold">
                  <i className="bi bi-geo-alt-fill me-1 text-danger"></i> Location
                </label>
                <select className="form-select" name="location" value={filters.location} onChange={handleFilterChange}>
                  <option value="">All</option>
                  {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Movie Cards */}
        <div className="col-md-9">
          <h2 className="mb-4">
            {searchQuery ? (
              <>
                <i className="bi bi-search"></i> Search Results for: <em>{searchQuery}</em>
              </>
            ) : (
              <>
                <i className="bi bi-film"></i> All Movies
              </>
            )}
          </h2>
          <div className="row">
            {filteredMovies.length === 0 ? (
              <div className="alert alert-warning text-center">No movies found.</div>
            ) : (
              filteredMovies.map(movie => (
                <div className="col-md-4 mb-4" key={movie.id}>
                  <div className="card h-100 movie-card shadow-sm">
                    <div className="card-img-wrapper">
                      <img
                        src={
                          movie.poster
                            ? movie.poster.startsWith("http")
                              ? movie.poster
                              : `http://127.0.0.1:8000${movie.poster}`
                            : "https://via.placeholder.com/180x240?text=No+Image"
                        }
                        className="card-img-top"
                        alt={movie.name}
                        style={{
                          height: "350px",
                          objectFit: "cover",
                          borderRadius: "12px 12px 0 0"
                        }}
                        onClick={() => handleBookTickets(movie)}
                      />
                      <span className="movie-badge">{movie.category}</span>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold">{movie.name}</h5>
                      <p className="card-text mb-1" style={{ color: "#ffb400", fontWeight: "bold" }}>
                         {movie.rating}
                      </p>
                      <p className="card-text text-muted mb-1" style={{ fontSize: "0.95rem" }}>
                        {Array.isArray(movie.type) && movie.type.length > 0
                          ? movie.type.map(t => t.name || t).join(", ")
                          : "No Type"}
                      </p>
                      <p className="card-text mb-2" style={{ fontSize: "0.95rem", color: "#198754", fontWeight: 500 }}>
                        <i className="bi bi-geo-alt-fill"></i>{" "}
                        {getMovieLocations(movie.id)}
                      </p>
                      <button
                        className="btn btn-success mt-auto"
                        style={{ borderRadius: "20px", fontWeight: 500, letterSpacing: "1px" }}
                        onClick={() => handleBookTickets(movie)}
                      >
                        Book Tickets
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customer;
