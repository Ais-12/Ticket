import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// --- Constants ---
const ROWS = [
  { label: "A", section: "Budget", price: 60 },
  { label: "B", section: "Budget", price: 60 },
  { label: "C", section: "Budget", price: 60 },
  { label: "D", section: "Elite", price: 150 },
  { label: "E", section: "Elite", price: 150 },
  { label: "F", section: "Elite", price: 150 },
  { label: "G", section: "Elite", price: 150 },
  { label: "H", section: "Elite", price: 150 },
  { label: "I", section: "Elite", price: 150 },
  { label: "J", section: "Elite", price: 150 },
  { label: "K", section: "Elite", price: 150 },
  { label: "L", section: "Elite", price: 150 },
  { label: "M", section: "Elite", price: 150 },
];
const SEATS_PER_ROW = 10;

const bookedSeats = ["A3", "B5", "F7", "J2"]; // Replace with API in real app

function Seat() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [movie, setMovie] = useState(null);
  const [theater, setTheater] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/show/${showId}/`)
      .then(res => {
        setShowDetails(res.data);
        if (res.data.movie) {
          const movieId = typeof res.data.movie === "object" ? res.data.movie.id : res.data.movie;
          axios.get(`http://127.0.0.1:8000/api/movies/${movieId}/`).then(movRes => setMovie(movRes.data));
        }
        if (res.data.theater) {
          const theaterId = typeof res.data.theater === "object" ? res.data.theater.id : res.data.theater;
          axios.get(`http://127.0.0.1:8000/api/theater/${theaterId}/`).then(theaterRes => setTheater(theaterRes.data));
        }
      })
      .catch(() => {
        setShowDetails(null);
        setMovie(null);
        setTheater(null);
      });
  }, [showId]);

  const isBooked = seatId => bookedSeats.includes(seatId);
  const isSelected = seatId => selectedSeats.includes(seatId);

  const handleSeatClick = (seatId, price) => {
    if (isBooked(seatId)) return;
    if (isSelected(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else if (selectedSeats.length < 10) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const getSeatPrice = seatId => {
    const rowLabel = seatId[0];
    const row = ROWS.find(r => r.label === rowLabel);
    return row ? row.price : 0;
  };

  const totalPrice = selectedSeats.reduce((sum, seatId) => sum + getSeatPrice(seatId), 0);

  function getLanguages(showDetails, movie) {
    if (showDetails && showDetails.languages) {
      if (Array.isArray(showDetails.languages)) {
        if (typeof showDetails.languages[0] === "object") {
          return showDetails.languages.map(l => l.name || l).join(", ");
        }
        return showDetails.languages.join(", ");
      }
      return showDetails.languages || "";
    }
    if (movie && movie.languages) {
      if (Array.isArray(movie.languages)) {
        if (typeof movie.languages[0] === "object") {
          return movie.languages.map(l => l.name || l).join(", ");
        }
        return movie.languages.join(", ");
      }
      return movie.languages || "";
    }
    return "";
  }

  // Proceed to Booking Confirmation
  const handleProceed = () => {
    navigate('/booking-confirmation', {
      state: {
        selectedSeats,
        totalPrice,
        showDetails,
        movie,
        theater
      }
    });
  };

  return (
    <div className="container mt-4">
      {(movie || theater) && (
        <div className="row align-items-center mb-3">
          <div className="col-auto">
            {movie && (
              <img
                src={movie.poster}
                alt={movie.name}
                style={{
                  width: 90,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  background: "#eee"
                }}
              />
            )}
          </div>
          <div className="col">
            <h4 style={{ marginBottom: 6 }}>{movie?.name || "Loading..."}</h4>
            <div style={{ fontSize: 15, color: "#555" }}>
              <span><b>Date:</b> {showDetails?.date}</span> &nbsp;|&nbsp;
              <span><b>Time:</b> {showDetails?.time}</span> &nbsp;|&nbsp;
              <span><b>Language:</b> {getLanguages(showDetails, movie)}</span> &nbsp;|&nbsp;
              <span><b>Theater:</b> {theater?.name}</span> &nbsp;|&nbsp;
              <span><b>Location:</b> {theater?.location}</span>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-12 text-center">
          <h5 className="mb-3">Select Your Seats (Max 10)</h5>
        </div>
      </div>
      <div className="row g-4 justify-content-center">
        <div className="col-lg-8 col-md-10 col-12">
          <div className="d-flex flex-wrap gap-3 justify-content-center mb-2">
            <span>
              <span style={{ display: "inline-block", width: 20, height: 20, background: "white", border: "2px solid #198754", borderRadius: "5px", marginRight: 4 }} /> Available
            </span>
            <span>
              <span style={{ display: "inline-block", width: 20, height: 20, background: "#28a745", border: "1px solid #aaa", borderRadius: "5px", marginRight: 4 }} /> Selected
            </span>
            <span>
              <span style={{ display: "inline-block", width: 20, height: 20, background: "#eee", border: "1px solid #aaa", borderRadius: "5px", marginRight: 4 }} /> Booked
            </span>
          </div>
          <div style={{
            border: "2px solid #bbb",
            padding: 16,
            borderRadius: 10,
            background: "#fafafa",
            marginBottom: 24,
            overflowX: "auto"
          }}>
            <div style={{ textAlign: "center", marginTop: 10, color: "#888" }}>
              <span style={{ borderTop: "2px solid #444", display: "inline-block", width: "80%" }}></span>
              <br />
              <span style={{ fontSize: 12 }}>SCREEN THIS SIDE</span>
            </div>
            <br />
            {ROWS.map(row => (
              <div key={row.label} style={{ marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                <span style={{ width: 24, fontWeight: "bold" }}>{row.label}</span>
                {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                  const seatId = `${row.label}${i + 1}`;
                  const booked = isBooked(seatId);
                  const selected = isSelected(seatId);
                  return (
                    <button
                      key={seatId}
                      style={{
                        width: 32,
                        height: 32,
                        margin: "0 3px",
                        background: booked ? "#eee" : selected ? "#28a745" : "white",
                        border: booked ? "1px solid #aaa" : "1px solid #198754",
                        borderRadius: 8,
                        color: booked ? "black" : "#222",
                        cursor: booked ? "not-allowed" : "pointer",
                        fontWeight: selected ? "bold" : "normal",
                        transition: "background 0.2s"
                      }}
                      disabled={booked || (!selected && selectedSeats.length >= 10)}
                      onClick={() => handleSeatClick(seatId, row.price)}
                      title={`${seatId} - ₹${row.price} (${row.section})`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
                <span style={{ marginLeft: 10, fontSize: 13, color: "#888" }}>
                  {row.section} ₹{row.price}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-12">
          <div className="card shadow-sm p-3">
            <h5>Booking Summary</h5>
            <div>
              <b>Selected Seats:</b><br />
              {selectedSeats.length
                ? selectedSeats.join(", ")
                : <span style={{ color: "#888" }}>None</span>}
            </div>
            <div className="mt-2">
              <strong>Total Price: </strong>
              <span className="text-success">₹{totalPrice}</span>
            </div>
            {selectedSeats.length > 0 && (
              <button
                className="btn btn-success mt-3 w-100"
                onClick={handleProceed}
              >
                Proceed to Booking Confirmation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Seat;
