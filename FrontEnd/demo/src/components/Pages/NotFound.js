import React from "react";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <img 
        src="/NotFound.jpg" 
        alt="Not Found" 
        style={{ marginTop: "20px", maxWidth: "400px" }}
      />
    </div>
  );
};