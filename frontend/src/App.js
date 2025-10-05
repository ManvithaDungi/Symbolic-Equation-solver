// src/App.js
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { Calculator, Home, TrendingUp, Info, Box } from "lucide-react";  // Removed Menu, X imports
import HomePage from "./pages/Home";
import Solver from "./pages/Solver";
import Visualization from "./pages/Visualization";
import Plot3DPage from "./pages/Plot3DPage";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === "/";

  // Removed unused toggleMenu function

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className={isHome ? "no-logo-glow" : ""} role="navigation" aria-label="Primary navigation">
      <NavLink to="/" className="logo" end onClick={handleLinkClick} aria-current={isHome ? "page" : undefined} tabIndex={0}>
        <Calculator size={20} aria-hidden="true" /> MathSolver
      </NavLink>

      <div className={`nav-links ${menuOpen ? "open" : ""}`} id="primary-navigation">
        <NavLink to="/" end onClick={handleLinkClick} tabIndex={menuOpen ? 0 : -1}>
          <Home size={14} aria-hidden="true" /> Home
        </NavLink>
        <NavLink to="/solver" onClick={handleLinkClick} tabIndex={menuOpen ? 0 : -1}>
          <Calculator size={14} aria-hidden="true" /> Solver
        </NavLink>
        <NavLink to="/visualization" onClick={handleLinkClick} tabIndex={menuOpen ? 0 : -1}>
          <TrendingUp size={14} aria-hidden="true" /> Visualize
        </NavLink>
        <NavLink to="/plot3d" onClick={handleLinkClick} tabIndex={menuOpen ? 0 : -1}>
          <Box size={14} aria-hidden="true" /> 3D Plot
        </NavLink>
        <NavLink to="/about" onClick={handleLinkClick} tabIndex={menuOpen ? 0 : -1}>
          <Info size={14} aria-hidden="true" /> About
        </NavLink>
      </div>
    </nav>
  );
};

const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/solver" element={<Solver />} />
          <Route path="/visualization" element={<Visualization />} />
          <Route path="/plot3d" element={<Plot3DPage />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
