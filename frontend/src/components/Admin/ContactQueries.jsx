import React, { useEffect, useState } from "react";
import axios from "axios";

function ContactQueries() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/contact-messages/")
      .then(res => setMessages(Array.isArray(res.data) ? res.data : res.data.results || []));
  }, []);

  // Filter messages by search
  const filtered = messages.filter(msg =>
    msg.name.toLowerCase().includes(search.toLowerCase()) ||
    msg.email.toLowerCase().includes(search.toLowerCase()) ||
    msg.mobile.includes(search) ||
    msg.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4">User Queries</h2>
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search by name, email, mobile or message..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="row g-4">
        {filtered.length === 0 ? (
          <div className="alert alert-warning text-center">No queries found.</div>
        ) : (
          filtered.map(msg => (
            <div className="col-md-6 col-lg-4" key={msg.id}>
              <div className="card shadow h-100 border-success">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-person-circle fs-3 text-success me-2"></i>
                    <h5 className="card-title mb-0">{msg.name}</h5>
                  </div>
                  <p className="mb-1">
                    <i className="bi bi-envelope-fill text-success me-2"></i>
                    <span className="text-muted">{msg.email}</span>
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-telephone-fill text-success me-2"></i>
                    <span>{msg.mobile}</span>
                  </p>
                  <p className="mb-2">
  <i className="bi bi-chat-dots text-success me-2"></i>
  <span
    style={{
      background: "#e8f7ea",
      borderLeft: "4px solid #198754",
      padding: "10px 14px",
      borderRadius: "8px",
      display: "block",
      fontSize: "1.08rem",
      fontStyle: "italic",
      color: "#14532d",
      marginTop: "8px"
    }}
  >
    <i className="bi bi-quote text-success me-1"></i>
    {msg.message}
  </span>
</p>

                </div>
                <div className="card-footer bg-dark bg-opacity-10 border-top-0 text-end">
                  <small className="text-black">
                    <i className="bi bi-clock me-1"></i>
                    {new Date(msg.created_at).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ContactQueries;
