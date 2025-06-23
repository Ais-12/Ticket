// src/components/Footer.jsx
import React from "react";

function Footer({theme = 'light'}) {
    const bgClass = theme == "dark" ? "bg-dark" :"bg-light";
    const textClass = theme =="dark"? "text-light" : "text-muted";
  return (
    <footer className= {` ${bgClass} bg-light text-center border-top mt-auto `} >
      <div className="container p-3">
        <span className={`${textClass}`}>
          &copy; {new Date().getFullYear()} Movie Tickets. All rights reserved.
        </span>
        <span className="mx-2">|</span>
        <a
          href="https://yourwebsite.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none text-success"
        >
          Visit our website
        </a>
      </div>
    </footer>
  );
}

export default Footer;
