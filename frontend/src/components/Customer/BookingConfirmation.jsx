import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";

function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure booking data from navigation state
  const {
    selectedSeats = [],
    totalPrice = 0,
    showDetails = {},
    movie = {},
    theater = {},
  } = location.state || {};

  // If no booking data, redirect back to home or booking page
  if (!location.state) {
    return (
      <Container
        className="my-5 d-flex align-items-center justify-content-center"
        style={{
          minHeight: "80vh",
          background: "linear-gradient(120deg, #e0ffe6 0%, #d2f8e5 100%)",
          borderRadius: "24px",
        }}
      >
        <Alert variant="success" className="text-center w-100">
          <div style={{ fontSize: "2.2rem" }}>
            <i className="bi bi-exclamation-triangle-fill text-success"></i>
          </div>
          <div>No booking details found. Please start your booking again.</div>
          <Button variant="success" className="mt-3" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </Alert>
      </Container>
    );
  }

  // Helper for languages
  const getLanguages = () => {
    if (movie.languages) {
      if (Array.isArray(movie.languages)) {
        if (typeof movie.languages[0] === "object") {
          return movie.languages.map(l => l.name || l).join(", ");
        }
        return movie.languages.join(", ");
      }
      return movie.languages;
    }
    return "N/A";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg,rgb(237, 238, 237) 0%,rgb(229, 234, 231) 100%)",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={9}>
            <Card
              className="shadow-lg border-0"
              style={{
                borderRadius: "24px",
                background: "#fff",
                padding: "32px 0",
              }}
            >
              <Row className="g-0 align-items-center">
                {/* Movie Poster & Info */}
                <Col md={5} className="text-center">
                  <div className="d-flex flex-column align-items-center justify-content-center h-100">
                    {/* <div
                      className="d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: "70px",
                        height: "70px",
                        background: "linear-gradient(120deg, #a8ff78 0%, #78ffd6 100%)",
                        borderRadius: "50%",
                        boxShadow: "0 4px 24px rgba(25,135,84,0.15)",
                      }}
                    >
                    </div> */}
                    <img
                      src={movie.poster}
                      alt={movie.name}
                      className="img-fluid rounded shadow mb-3"
                      style={{
                        maxHeight: 350,
                        objectFit: "cover",
                        borderRadius: "30px",
                        border: "5px solidrgb(7, 7, 7)",
                        background: "#e0ffe6",
                      }}
                    />
                    <h4 className="fw-bold text-success mb-1">{movie.name}</h4>
                    <div className="mb-2" style={{  fontWeight: 600 }}>
                      {movie.category || (movie.type?.map(t => t.name).join(", "))} || {getLanguages()}
                    </div>
                    
                  </div>
                </Col>

                {/* Booking Details */}
                <Col md={7}>
                  <div className="p-4">
                    <h2 className="text-success fw-bold mb-2">
                      Payment Successful!
                    </h2>
                    <p className="fs-5 fst-italic mb-4 text-dark">
                      Enjoy your movie! 🎥🍿
                    </p>
                    <Card
                      className="mb-3 border-0 shadow-sm"
                      style={{
                        borderRadius: "16px",
                        background: "linear-gradient(120deg, #e0ffe6 0%,rgb(214, 245, 222) 100%)",
                      }}
                    >
                      <Card.Body>
                        <h5 className="fw-bold mb-3">
                          Show & Theater Details
                        </h5>
                        <p className="mb-1">
                          <b>Date:</b> {showDetails.date || "N/A"}
                        </p>
                        <p className="mb-1">
                          <b>Time:</b> {showDetails.time || "N/A"}
                        </p>
                        <p className="mb-1">
                          <b>Theater:</b> {theater.name || "N/A"}
                        </p>
                        <p className="mb-1">
                          <b>Location:</b> {theater.location || "N/A"}
                        </p>
                      </Card.Body>
                    </Card>
                    <Card
                      className="mb-3 border-0 shadow-sm"
                      style={{
                        borderRadius: "16px",
                        background: "linear-gradient(120deg, #e0ffe6 0%, rgb(214, 245, 222) 100%)",
                      }}
                    >
                      <Card.Body>
                        <h5 className="fw-bold mb-3">
                          Booking Details
                        </h5>
                        <p className="mb-1">
                          <b>Seats Booked:</b>{" "}
                          {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                        </p>
                        <p className="mb-1">
                          <b>Total Price:</b>{" "}
                          <span className="text-success fs-5 fw-bold">₹{totalPrice}</span>
                        </p>
                      </Card.Body>
                    </Card>
                    <div className="mt-4 text-center">
                      <Button
                        variant="success"
                        size="lg"
                        className="fw-bold px-4 rounded-pill shadow"
                        onClick={() => navigate("/customer")}
                      >
                        <i className="bi bi-house-door-fill me-2"></i>
                        Back to Home
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BookingConfirmation;
