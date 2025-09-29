//frontend/src/pages/NotFound.js
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="notfound-container" role="main" aria-labelledby="notfound-title">
      <h1 id="notfound-title">404</h1>
      <p>Oops! Page not found</p>
      <Link to="/" className="btn">
        Return to Home
      </Link>
    </main>
  );
};

export default NotFound;
