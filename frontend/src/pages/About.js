// src/pages/About.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, Heart, TrendingUp, Zap, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import "./About.css";

const About = () => {
  const [apiInfo] = useState({
    version: "1.0.0",
    lastUpdate: new Date().toLocaleDateString(),
    features: 12,
  });

  const technologies = [
    { name: "React.js", description: "Frontend framework with hooks and class components" },
    { name: "JavaScript", description: "Modern ES6+ JavaScript for dynamic functionality" },
    { name: "Math.js", description: "Comprehensive math library for computations" },
    { name: "Recharts", description: "Powerful charting library for visualizations" },
    { name: "Framer Motion", description: "Smooth animations and transitions" },
    { name: "Custom CSS", description: "Professional styling with CSS variables" },
  ];

  const features = [
    { icon: Calculator, title: "Mathematical Parsing", description: "Supports complex expressions" },
    { icon: TrendingUp, title: "Interactive Graphs", description: "Real-time function visualization" },
    { icon: Zap, title: "Step-by-Step Solutions", description: "Detailed breakdowns" },
    { icon: BookOpen, title: "Educational Focus", description: "Helps students learn effectively" },
  ];

  return (
    <main className="about-container">
      {/* Header */}
      <motion.div
        className="about-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Calculator size={32} />
        <h1>About MathSolver</h1>
        <p>A comprehensive equation solver built with modern web technologies.</p>
      </motion.div>

      {/* Features */}
      <section className="features-section">
        <h2>Key Features</h2>
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            className="feature-card"
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <feature.icon size={20} />
            <strong>{feature.title}</strong>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </section>

      {/* Technology Stack */}
      <section className="tech-stack-section">
        <h2>Technology Stack</h2>
        {technologies.map((tech, i) => (
          <motion.div
            key={tech.name}
            className="tech-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <h4>{tech.name}</h4>
            <p>{tech.description}</p>
          </motion.div>
        ))}
      </section>

      {/* API Info */}
      <section className="api-info-section">
        <h3>API Information</h3>
        <p>Version: {apiInfo.version}</p>
        <p>Last Update: {apiInfo.lastUpdate}</p>
        <p>Features: {apiInfo.features}</p>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to Solve Complex Equations?</h2>
        <p>Start exploring the power of our advanced solver.</p>
        <div className="cta-links">
          <Link to="/solver" className="btn"><Calculator size={16} /> Try the Solver</Link>
          <Link to="/visualization" className="btn"><TrendingUp size={16} /> Explore Graphs</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <p>Made with <Heart size={14} /> by Manvitha Dungi</p>
      </footer>
    </main>
  );
};

export default About;
