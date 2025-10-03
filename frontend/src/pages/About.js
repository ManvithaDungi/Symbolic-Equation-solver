// src/pages/About.js
// REACT CONCEPTS USED:
// - Functional Component with Hooks (useState, useEffect)
// - State Management (multiple useState hooks for different data)
// - Component Lifecycle (useEffect with cleanup function)
// - Event Handling (setInterval for dynamic stats)
// - Conditional Rendering (motion components with conditional animations)
// - Lists & Keys (map function with unique keys for rendering arrays)
// - Props (motion components receive animation props)
// - Component Composition (motion.div wrapping content)

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calculator, Heart, TrendingUp, Zap, BookOpen, Code2, Layers, 
  Server, Database, GitBranch, Shield, Clock, 
  Activity, Globe, Terminal, Package, Cpu, Network, Sliders, Box } from "lucide-react";
import { motion } from "framer-motion";
import "./About.css";

const About = () => {
  // REACT CONCEPT: State Management with useState
  // Managing multiple pieces of state for API info and dynamic statistics
  const [apiInfo] = useState({
    version: "1.0.0", lastUpdate: new Date().toLocaleDateString(),
    features: 12, uptime: "99.9%", requests: "1,234"
  });

  const [stats, setStats] = useState({
    expressionsSolved: 0, usersServed: 0, uptime: 0
  });

  // REACT CONCEPT: Component Lifecycle with useEffect
  // Side effect for simulating real-time stats updates with cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        expressionsSolved: prev.expressionsSolved + Math.floor(Math.random() * 3),
        usersServed: prev.usersServed + Math.floor(Math.random() * 2),
        uptime: 99.9,
      }));
    }, 2000);
    return () => clearInterval(interval); // Cleanup function
  }, []); // Empty dependency array - runs once on mount

  // REACT CONCEPT: Data Organization
  // Static data arrays for rendering lists - demonstrates separation of data and presentation
  const frontendTechnologies = [
    { name: "React.js", description: "Frontend framework with hooks and class components", icon: Code2 },
    { name: "Three.js", description: "3D graphics library for WebGL-based visualizations", icon: Box },
    { name: "React Three Fiber", description: "React renderer for Three.js with declarative 3D scenes", icon: Cpu },
    { name: "JavaScript", description: "Modern ES6+ JavaScript for dynamic functionality", icon: Terminal },
    { name: "Math.js", description: "Comprehensive math library for computations", icon: Calculator },
    { name: "Recharts", description: "Powerful charting library for visualizations", icon: TrendingUp },
    { name: "Framer Motion", description: "Smooth animations and transitions", icon: Activity },
    { name: "Custom CSS", description: "Professional styling with CSS variables", icon: Layers },
    { name: "React Router", description: "Client-side routing and navigation", icon: Globe },
    { name: "Lucide Icons", description: "Beautiful, customizable SVG icons", icon: Package },
  ];

  const backendTechnologies = [
    { name: "Node.js", description: "JavaScript runtime for server-side development", icon: Server },
    { name: "Express.js", description: "Fast, unopinionated web framework", icon: Network },
    { name: "Math.js", description: "Advanced mathematical computations", icon: Calculator },
    { name: "CORS", description: "Cross-Origin Resource Sharing middleware", icon: Shield },
    { name: "dotenv", description: "Environment variable management", icon: Database },
    { name: "Path Module", description: "File and directory path utilities", icon: GitBranch },
  ];

  const features = [
    { icon: Calculator, title: "Advanced Mathematical Parsing", description: "Supports complex expressions including derivatives, integrals, limits, and algebraic equations with step-by-step solutions" },
    { icon: TrendingUp, title: "3D Function Visualization", description: "Interactive 3D surface plotting with rotation, zoom, and real-time parameter manipulation using WebGL technology" },
    { icon: Sliders, title: "Interactive Parameter Manipulation", description: "Drag sliders to see how parameters affect functions in real-time with smooth animations and instant feedback" },
    { icon: Zap, title: "Mathematical Concept Animations", description: "Watch key mathematical concepts come to life through animated demonstrations of derivatives, integrals, and more" },
    { icon: BookOpen, title: "Educational Focus", description: "Designed specifically to help students learn mathematical concepts through interactive problem-solving and visual learning" },
    { icon: Shield, title: "Robust Error Handling", description: "Comprehensive validation and error messages to guide users toward correct input formats" },
    { icon: Activity, title: "Real-time Processing", description: "Instant computation and visualization with smooth animations and responsive user interface" },
    { icon: Globe, title: "Multi-Modal Learning", description: "2D graphs, 3D surfaces, interactive manipulation, and animated sequences for comprehensive mathematical understanding" },
  ];

  const reactConcepts = [
    { name: "Props & PropTypes", description: "Component communication and type validation across Solver.js, Visualizer.js, and other components" },
    { name: "State Management", description: "useState hooks managing form data, visualization parameters, and UI state throughout the application" },
    { name: "Component Lifecycle", description: "useEffect hooks for side effects, data fetching, and component mounting/unmounting" },
    { name: "Event Handling", description: "Form submissions, input changes, chart interactions, and user interface events" },
    { name: "Conditional Rendering", description: "Dynamic UI updates based on state, loading conditions, and user interactions" },
    { name: "Lists & Keys", description: "Rendering dynamic lists of features, technologies, and mathematical steps with proper key management" },
    { name: "Routing & Navigation", description: "React Router implementation with BrowserRouter, Routes, and Link components" },
    { name: "Custom Hooks", description: "Reusable logic extraction and state management patterns" },
    { name: "Context API", description: "Global state management for theme, user preferences, and application settings" },
    { name: "Error Boundaries", description: "Error handling and fallback UI components for graceful error management" },
    { name: "Performance Optimization", description: "Memoization, lazy loading, and component optimization techniques" },
    { name: "HTTP Client Integration", description: "API communication with proper error handling and loading states" },
  ];

  const nodejsConcepts = [
    { name: "Express.js Framework", description: "RESTful API development with middleware, routing, and request/response handling" },
    { name: "Middleware Architecture", description: "CORS, JSON parsing, error handling, and custom middleware implementation" },
    { name: "Route Management", description: "Modular routing with express.Router() for organized API endpoints" },
    { name: "Error Handling", description: "Comprehensive error catching, logging, and user-friendly error responses" },
    { name: "Environment Configuration", description: "dotenv for secure environment variable management and configuration" },
    { name: "Module System", description: "CommonJS modules with require() and module.exports for code organization" },
    { name: "File System Operations", description: "Path module for cross-platform file path handling and static file serving" },
    { name: "HTTP Methods", description: "GET, POST endpoints with proper status codes and response formatting" },
    { name: "Request Validation", description: "Input validation, sanitization, and error handling for API endpoints" },
    { name: "Server Configuration", description: "Port management, CORS setup, and production/development environment handling" },
    { name: "Mathematical Processing", description: "Integration with math.js library for complex mathematical computations" },
    { name: "API Documentation", description: "Structured API responses with success/error states and metadata" },
  ];

  // REACT CONCEPT: Helper Functions
  // Reusable functions for creating motion components with consistent animations
  const createStatCard = (icon, value, label) => (
    <motion.div 
      className="stat-card"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {React.createElement(icon, { size: 24 })}
      <div className="value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="label">{label}</div>
    </motion.div>
  );

  return (
    <main className="about-container">
      {/* REACT CONCEPT: Component Composition - Header with motion wrapper */}
      <motion.div className="about-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Calculator size={32} />
        <h1>About MathSolver</h1>
        <p>A comprehensive equation solver built with modern web technologies, featuring advanced mathematical processing and interactive visualizations.</p>
      </motion.div>

      {/* REACT CONCEPT: Lists & Keys - Statistics section with dynamic data */}
      <motion.section className="stats-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
        {createStatCard(Calculator, stats.expressionsSolved, "Expressions Solved")}
        {createStatCard(Activity, stats.usersServed, "Users Served")}
        {createStatCard(Clock, `${stats.uptime}%`, "Uptime")}
        {createStatCard(Cpu, apiInfo.features, "Features")}
      </motion.section>
      {/* REACT CONCEPT: Lists & Keys - Features section with map function */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          {features.map((feature, i) => (
            <motion.div key={feature.title} className="feature-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} whileHover={{ scale: 1.02, y: -5 }}>
              <feature.icon size={24} />
              <strong>{feature.title}</strong>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* REACT CONCEPT: Lists & Keys - React concepts with proper key management */}
      <section className="concepts-section">
        <h2>React Concepts & Features Used</h2>
        <div className="concepts-grid">
        {reactConcepts.map((concept, i) => (
            <motion.div key={concept.name} className="concept-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.05 }} whileHover={{ scale: 1.02 }}>
            <Code2 size={18} />
            <div>
              <strong>{concept.name}</strong>
              <p>{concept.description}</p>
            </div>
          </motion.div>
        ))}
        </div>
      </section>

      {/* REACT CONCEPT: Lists & Keys - Node.js concepts with staggered animations */}
      <section className="concepts-section">
        <h2>Node.js Backend Concepts & Features</h2>
        <div className="concepts-grid">
          {nodejsConcepts.map((concept, i) => (
            <motion.div key={concept.name} className="concept-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.05 }} whileHover={{ scale: 1.02 }}>
              <Server size={18} />
              <div>
                <strong>{concept.name}</strong>
                <p>{concept.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* REACT CONCEPT: Lists & Keys - Frontend tech stack with dynamic icons */}
      <section className="tech-stack-section">
        <h2>Frontend Technology Stack</h2>
        <div className="tech-grid">
          {frontendTechnologies.map((tech, i) => (
            <motion.div key={tech.name} className="tech-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.0 + i * 0.1 }} whileHover={{ scale: 1.05, y: -5 }}>
              <tech.icon size={20} />
              <h4>{tech.name}</h4>
              <p>{tech.description}</p>
          </motion.div>
        ))}
        </div>
      </section>

      {/* REACT CONCEPT: Lists & Keys - Backend tech stack with component composition */}
      <section className="tech-stack-section">
        <h2>Backend Technology Stack</h2>
        <div className="tech-grid">
          {backendTechnologies.map((tech, i) => (
            <motion.div key={tech.name} className="tech-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 + i * 0.1 }} whileHover={{ scale: 1.05, y: -5 }}>
              <tech.icon size={20} />
            <h4>{tech.name}</h4>
            <p>{tech.description}</p>
          </motion.div>
        ))}
        </div>
      </section>

      {/* REACT CONCEPT: Component Composition - Architecture diagram with nested motion components */}
      <motion.section className="architecture-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.4 }}>
        <h2>Application Architecture</h2>
        <div className="architecture-diagram">
          <motion.div className="arch-layer frontend" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}>
            <h3>Frontend (React.js)</h3>
            <p>User Interface & Interactions</p>
            <ul>
              <li>Component-based architecture</li>
              <li>State management with hooks</li>
              <li>Real-time visualizations</li>
              <li>Responsive design</li>
            </ul>
          </motion.div>
          
          <motion.div className="arch-arrow" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.6 }}>
            <Network size={24} />
          </motion.div>
          
          <motion.div className="arch-layer backend" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.7 }}>
            <h3>Backend (Node.js)</h3>
            <p>API & Mathematical Processing</p>
            <ul>
              <li>Express.js REST API</li>
              <li>Mathematical computations</li>
              <li>Error handling & validation</li>
              <li>Environment configuration</li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* REACT CONCEPT: Routing & Navigation - Link components for navigation */}
      <motion.section className="cta-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.8 }}>
        <h2>Ready to Solve Complex Equations?</h2>
        <p>Experience the power of our advanced mathematical solver with interactive visualizations and step-by-step solutions.</p>
        <div className="cta-links">
          <Link to="/solver" className="btn"><Calculator size={16} /> Try the Solver</Link>
          <Link to="/visualization" className="btn"><TrendingUp size={16} /> Explore Graphs</Link>
        </div>
      </motion.section>

      {/* REACT CONCEPT: Component Composition - Simple footer component */}
      <footer className="about-footer">
        <p>Made with <Heart size={14} /> by Manvitha Dungi</p>
      </footer>
    </main>
  );
};

export default About;
