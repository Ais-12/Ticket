import React, { useState } from "react";
import axios from "axios";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post("http://127.0.0.1:8000/api/contact-messages/", form);
      setSuccess("Your message has been sent! We will contact you soon.");
      setForm({ name: "", email: "", mobile: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg,rgb(213, 243, 218) 0%,rgb(213, 243, 218) 100%)",
      }}
    >
      <div
        className="position-relative"
        style={{ width: "min(800px, 98vw)", maxWidth: "98vw",left: "-7%" }}
      >
        {/* Main Row */}
        <div className="row align-items-center" style={{ minHeight: "420px" }}>
          {/* Contact Us Box (overlapping) */}
          <div
  className="col-md-4 position-absolute d-none d-md-block"
  style={{
    left: "5%",
    top: "15%",
    height: "100%",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
  }}
>
  <div
    className="card border-0 shadow-lg"
    style={{
      borderRadius: "20px",
      height: "70%", // 75% of big box
      minHeight: "300px",
      background:
        "linear-gradient(120deg, rgb(229, 241, 229) 0%, rgb(213, 230, 222) 100%)",
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div className="card-body d-flex flex-column justify-content-center align-items-center">
      {/* Add your image here */}
      <img
        src="/Contact.jpg"
        alt="Contact Illustration"
        style={{
          width: "210px",
          height: "150px",
          objectFit: "cover",
          marginBottom: "10px",
          borderRadius:"20px",
        }}
      />
      <h5 className="fw-bold text-success mb-3" style={{ fontSize: "1.3rem" }}>
        <i className="bi bi-envelope-paper-heart me-2"></i>Contact Us
      </h5>
      <ul className="list-unstyled mb-0">
        <li className="mb-3 d-flex align-items-center">
          <i className="bi bi-envelope-fill text-primary fs-5 me-2"></i>
          <span>
            <a
              href="mailto:support@ticketsnest.com"
              className="text-decoration-none text-dark"
            >
              support@ticketsnest.com
            </a>
          </span>
        </li>
        <li className="mb-3 d-flex align-items-center">
          <i className="bi bi-telephone-fill text-success fs-5 me-2"></i>
          <span>+91 98765 43210</span>
        </li>
        <li className="d-flex align-items-center">
          <i className="bi bi-geo-alt-fill text-danger fs-5 me-2"></i>
          <span>123, Main Road, Chennai, India</span>
        </li>
      </ul>
    </div>
  </div>
</div>

          {/* Send Us a Message Box */}
          <div className="col-12 col-md-12 offset-md-2">
            <div
              className="card shadow-lg border-0"
              style={{
                borderRadius: "24px",
                minHeight: "420px",
                display: "flex",
                justifyContent: "center",
                paddingLeft: "170px", // Push form a bit right to avoid overlap
                background: "#fff",
              }}
            >
              <div className="card-body px-4 py-4">
                <div
                  className="fw-bold mb-4 text-success"
                  style={{
                    fontSize: "1.6rem",
                    color: "#222",
                    letterSpacing: "1px",
                  }}
                >
                  <i className="bi bi-chat-dots me-2 text- bg-success"></i>
                  Send us a message
                </div>
                <p className="mb-4 text-muted" style={{ fontSize: "1.08rem" }}>
                  Have questions, feedback, or need help? Fill out the form below and we’ll get back to you!
                </p>
                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Your Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: "16px" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Your Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: "16px" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Mobile Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: "16px" }}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Message</label>
                      <textarea
                        className="form-control"
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: "16px" }}
                      ></textarea>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success w-100 fw-bold mt-4"
                    style={{
                      borderRadius: "24px",
                      fontSize: "1.1rem",
                      padding: "12px 0",
                      letterSpacing: "1px",
                      boxShadow: "0 4px 24px rgba(25,135,84,0.12)",
                    }}
                  >
                    <i className="bi bi-send me-2"></i>Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* On mobile, show contact info below the form */}
          <div className="col-12 d-md-none mt-10">
            <div
              className="card border-0 shadow"
              style={{
                borderRadius: "18px",
                background:
                  "linear-gradient(120deg, rgb(202, 247, 218) 0%, rgb(84, 170, 107) 100%)",
                border: "3px solidrgb(7, 7, 7)",
              }}
            >
              <div className="card-body py-4 px-3">
                <h6 className="fw-bold text-success mb-3" style={{ fontSize: "1rem" }}>
                  <i className="bi bi-envelope-paper-heart me-2"></i>Contact Us
                </h6>
                <ul className="list-unstyled mb-0">
                  <li className="mb-3 d-flex align-items-center">
                    <i className="bi bi-envelope-fill text-primary fs-6 me-2"></i>
                    <span>
                      <a
                        href="mailto:support@ticketsnest.com"
                        className="text-decoration-none text-dark"
                      >
                        support@ticketsnest.com
                      </a>
                    </span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <i className="bi bi-telephone-fill text-success fs-6 me-2"></i>
                    <span>+91 98765 43210</span>
                  </li>
                  <li className="d-flex align-items-center">
                    <i className="bi bi-geo-alt-fill text-danger fs-6 me-2"></i>
                    <span>123, Main Road, Chennai</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
