import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Home.css"; // We'll use this for custom styles

function Home({ searchQuery }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/movies/")
      .then(res => res.json())
      .then(data => setMovies(Array.isArray(data) ? data : data.results || []));
  }, []);

  const filteredMovies = searchQuery
    ? movies.filter(movie =>
        movie.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const latestMovies = movies.filter(movie => movie.category === "latest").slice(0, 3);
  const recommendedMovies = movies.filter(movie => movie.category === "recommended").slice(0, 3);

  const renderMovieCards = (movieList) => (
    <Row xs={1} md={3} className="g-4">
      {movieList.map(movie => (
        <Col key={movie.id}>
          <Card className="movie-card border-0 shadow-lg h-100">
            <div className="card-img-wrapper">
              <Card.Img
                variant="top"
                src={
                  movie.poster
                    ? movie.poster.startsWith("http")
                      ? movie.poster
                      : `http://127.0.0.1:8000${movie.poster}`
                    : "https://via.placeholder.com/180x240?text=No+Image"
                }
                alt={movie.name}
                className="fixed-poster"
                style={{ width: "100%", height: "350px", objectFit: "cover", borderRadius: "12px 12px 0 0" }}
              />
              <span className="movie-badge">{movie.category}</span>
            </div>
            <Card.Body className="d-flex flex-column">
              <Card.Title className="mb-2" style={{ fontWeight: 600, fontSize: "1.3rem" }}>
                {movie.name}
              </Card.Title>
              <Card.Text className="mb-1" style={{ color: "#ffb400", fontWeight: "bold" }}>
                {movie.rating}
              </Card.Text>
              <Card.Text className="mb-2 text-muted" style={{ fontSize: "0.95rem" }}>
                {Array.isArray(movie.type) && movie.type.length > 0
                  ? movie.type.map(t => t.name || t).join(", ")
                  : "No Type"}
              </Card.Text>
              <Button
                as={Link}
                to="/login"
                variant="success"
                className="mt-auto"
                style={{ borderRadius: "20px", fontWeight: 500, letterSpacing: "1px" }}
              >
                Book Tickets
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <>
      {/* Hero Banner */}
      <div className="hero-banner d-flex align-items-center justify-content-center mb-5">
        <div className="text-center">
          <img
            src="./poster2.jpg"
            alt="poster"
            className="shadow-lg hero-img"
          />
          <h1 className="display-5 mt-4 mb-2 fw-bold text-success">
            Welcome to Tickets Nest 🎬
          </h1>
          <p className="lead text-secondary">
            Book your favorite movies & shows instantly. Discover the latest blockbusters and exclusive recommendations!
          </p>
        </div>
      </div>

      <div className="container mt-4">
        {searchQuery ? (
          <>
            <h2 className="mb-4">
              <i className="bi bi-search"></i> Search Results for: <em>{searchQuery}</em>
            </h2>
            {filteredMovies.length > 0
              ? renderMovieCards(filteredMovies)
              : <div className="alert alert-warning">No movies found.</div>}
          </>
        ) : (
          <>
            <h2 className="mb-4">
              <i className="bi bi-fire"></i> Latest Movies
            </h2>
            {renderMovieCards(latestMovies)}

            <h2 className="mt-5 mb-4">
              <i className="bi bi-star-fill text-warning"></i> Recommended for You
            </h2>
            {renderMovieCards(recommendedMovies)}
          </>
        )}
      </div>
    </>
  );
}

export default Home;

