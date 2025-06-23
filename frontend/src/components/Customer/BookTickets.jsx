import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SHOWS_API_URL = "http://127.0.0.1:8000/api/show/";
const MOVIE_API_URL = "http://127.0.0.1:8000/api/movies/";
const THEATER_API_URL = "http://127.0.0.1:8000/api/theater/";

function BookTickets() {
  const { id } = useParams(); // movie id
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [movie, setMovie] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowId, setSelectedShowId] = useState("");
  const [theaters, setTheaters] = useState({}); // id -> theater object

  // Fetch shows and movie details
  useEffect(() => {
    axios.get(SHOWS_API_URL).then(res => {
      const movieShows = res.data.filter(show =>
        (show.movie && show.movie.id && String(show.movie.id) === String(id)) ||
        (typeof show.movie === "number" && String(show.movie) === String(id))
      );
      setShows(movieShows);

      if (movieShows.length > 0) {
        const firstMovie = movieShows[0].movie;
        if (typeof firstMovie === "object") {
          setMovie(firstMovie);
        } else if (typeof firstMovie === "number") {
          axios.get(`${MOVIE_API_URL}${firstMovie}/`).then(res => setMovie(res.data));
        }
      }

      // Unique languages
      const langs = new Set();
      movieShows.forEach(show => {
        (show.languages || []).forEach(l => langs.add(l));
      });
      setLanguages(Array.from(langs));
    });
  }, [id]);

  // Dates filtered by selected language
  useEffect(() => {
    if (selectedLanguage) {
      const filteredDates = [
        ...new Set(
          shows
            .filter(show => (show.languages || []).includes(selectedLanguage))
            .map(show => show.date)
        ),
      ];
      setDates(filteredDates);
      setSelectedDate("");
      setShowtimes([]);
      setSelectedShowId("");
    } else {
      setDates([]);
      setSelectedDate("");
      setShowtimes([]);
      setSelectedShowId("");
    }
  }, [selectedLanguage, shows]);

  // Showtimes filtered by language and date + fetch theaters if needed
  useEffect(() => {
    if (selectedLanguage && selectedDate) {
      const times = shows
        .filter(
          show =>
            show.date === selectedDate &&
            (show.languages || []).includes(selectedLanguage)
        )
        .map(show => ({
          id: show.id,
          time: show.time,
          theater: show.theater,
          languages: show.languages,
        }));

      // Find missing theater IDs (those that are just numbers and not already loaded)
      const missingTheaterIds = times
        .map(st => (typeof st.theater === "number" ? st.theater : st.theater?.id))
        .filter(
          tid => tid && !theaters[tid]
        );

      // Fetch missing theater details in parallel
      if (missingTheaterIds.length > 0) {
        Promise.all(
          missingTheaterIds.map(tid =>
            axios.get(`${THEATER_API_URL}${tid}/`)
          )
        ).then(results => {
          const newTheaters = { ...theaters };
          results.forEach(res => {
            newTheaters[res.data.id] = res.data;
          });
          setTheaters(newTheaters);
        });
      }

      setShowtimes(times);
      setSelectedShowId("");
    } else {
      setShowtimes([]);
      setSelectedShowId("");
    }
    // eslint-disable-next-line
  }, [selectedLanguage, selectedDate, shows]);

  if (!movie && shows.length === 0) return <div>No shows available for this movie.</div>;
  if (!movie) return <div>Loading...</div>;

  const handleProceed = (e) => {
    e.preventDefault();
    navigate(`/select-seats/${selectedShowId}`);
  };
  

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Poster and Details */}
        <div className="col-md-4">
          <img
            src={movie.poster}
            alt={movie.name}
            className="img-fluid rounded"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-8">
          <h2>{movie.name}</h2>
          <p><strong>Genre:</strong> {movie.category || (movie.type?.map(t => t.name).join(", "))}</p>
          <p>
            <strong>Languages:</strong>{" "}
            {(movie.languages || []).map(l => l.name || l).join(", ")}
          </p>
          <p><strong>Released:</strong> {movie.released_date}</p>
          <p><strong>Description:</strong> {movie.description}</p>
          <p><strong>Rating:</strong> {movie.rating}</p>
          <hr />
          <h4>Book Your Tickets</h4>
          <form onSubmit={handleProceed}>
            <div className="mb-3">
              <label className="form-label">Select Language</label>
              <select
                className="form-select"
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value)}
                required
              >
                <option value="">-- Select Language --</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Select Date</label>
              <select
                className="form-select"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                required
                disabled={!selectedLanguage}
              >
                <option value="">-- Select Date --</option>
                {dates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Select Showtime</label>
              <select
                className="form-select"
                value={selectedShowId}
                onChange={e => setSelectedShowId(e.target.value)}
                required
                disabled={!selectedDate}
              >
                <option value="">-- Select Showtime --</option>
                {showtimes.map(st => {
                  let theaterName = "";
                  if (typeof st.theater === "object") {
                    theaterName = st.theater.name;
                  } else if (typeof st.theater === "number" && theaters[st.theater]) {
                    theaterName = theaters[st.theater].name;
                  }
                  return (
                    <option key={st.id} value={st.id}>
                      {st.time} at {theaterName}
                    </option>
                  );
                })}
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-success"
              disabled={!selectedShowId}
              onClick={handleProceed}
            >
              Proceed to Seat Selection
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookTickets;

