// src/pages/Visualization.js
// REACT CONCEPTS USED:
// - Functional Components with Hooks (useState, useCallback, useMemo, useEffect)
// - Props & PropTypes (type validation for GraphVisualizer component)
// - State Management (multiple useState hooks for different UI states)
// - Component Lifecycle (useEffect for side effects and cleanup)
// - Event Handling (button clicks, input changes, form interactions)
// - Conditional Rendering (different chart types, error states, pagination)
// - Lists & Keys (mapping over examples and calculations with proper keys)
// - Performance Optimization (useMemo for expensive calculations, useCallback for event handlers)
// - Component Composition (GraphVisualizer as child component)
// - Custom Hooks Pattern (reusable logic with hooks)
// - Pagination (state management for paginated content)

import React, { useState, useCallback, useMemo, useEffect } from "react";
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, BarChart3, Play, RotateCcw, Box, Sliders, Zap } from "lucide-react";
import { evaluate } from "mathjs";
import { motion } from "framer-motion";
import Plot3D from "../components/Plot3D";
import InteractiveManipulator from "../components/InteractiveManipulator";
import AnimationSequences from "../components/AnimationSequences";
import "./Visualization.css";

// REACT CONCEPT: Functional Component with Props - GraphVisualizer component
const GraphVisualizer = ({ equation, type = "function", domain = [-10, 10] }) => {
  // REACT CONCEPT: Performance Optimization - useMemo for expensive graph calculations
  const graphData = useMemo(() => {
    try {
      const data = [];
      const [min, max] = domain;
      const step = (max - min) / 200;
      for (let x = min; x <= max; x += step) {
        try {
          const expr = equation.replace(/x/g, `(${x})`);
          const y = evaluate(expr);
          if (typeof y === "number" && isFinite(y)) {
            data.push({ x: parseFloat(x.toFixed(3)), y: parseFloat(y.toFixed(3)) });
          }
        } catch {}
      }
      return data;
    } catch {
      return [];
    }
  }, [equation, domain]);

  // REACT CONCEPT: Helper Functions - Pure functions for UI logic
  const getChartTitle = () => {
    switch (type) {
      case "integral": return "Integral Visualization";
      case "derivative": return "Derivative Visualization";
      default: return "Function Graph";
    }
  };

  const getChartColor = () => {
    switch (type) {
      case "integral": return "#10b981";
      case "derivative": return "#f59e0b";
      default: return "#3b82f6";
    }
  };

  // REACT CONCEPT: Conditional Rendering - Error state when no graph data
  if (!graphData.length) {
    return (
      <div className="graph-error-container" role="alert" aria-live="polite">
        <BarChart3 size={48} aria-hidden="true" />
        <p>Unable to generate graph for this expression</p>
        <p>Try a simpler mathematical expression</p>
      </div>
    );
  }

  return (
    <section className="graph-visualizer-container" aria-label="Graph Visualization">
      <header className="graph-header">
        <TrendingUp size={24} aria-hidden="true" />
        <h3>{getChartTitle()}</h3>
        <p tabIndex={0}>f(x) = {equation}</p>
        <span aria-label={`Graph type: ${type}`}>{type}</span>
      </header>

      <div className="graph-canvas" style={{ height: 320, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          {/* REACT CONCEPT: Conditional Rendering - Different chart types based on graph type */}
          {type === "integral" ? (
            <AreaChart data={graphData} aria-label="Area chart showing integral visualization">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" fontSize={12} />
              <YAxis fontSize={12} />
              <Area type="monotone" dataKey="y" stroke={getChartColor()} fill={getChartColor()} fillOpacity={0.3} strokeWidth={2} />
            </AreaChart>
          ) : (
            <LineChart data={graphData} aria-label="Line chart showing function graph visualization">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" fontSize={12} />
              <YAxis fontSize={12} />
              <Line type="monotone" dataKey="y" stroke={getChartColor()} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: getChartColor() }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <footer className="graph-info">
        Domain: [{domain[0]}, {domain[1]}] • Points: {graphData.length}
      </footer>
    </section>
  );
};

// REACT CONCEPT: Props & PropTypes - Type validation for component props
GraphVisualizer.propTypes = {
  equation: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["function", "integral", "derivative"]),
  domain: PropTypes.arrayOf(PropTypes.number),
};
GraphVisualizer.defaultProps = { type: "function", domain: [-10, 10] };

// REACT CONCEPT: Functional Component with Multiple Hooks - Main Visualization component
const Visualization = () => {
  // REACT CONCEPT: State Management - Multiple useState hooks for different UI states
  const [equation, setEquation] = useState("x^2");
  const [graphType, setGraphType] = useState("function");
  const [domain, setDomain] = useState([-10, 10]);
  const [isGraphing, setIsGraphing] = useState(false);
  const [pastCalculations, setPastCalculations] = useState([]);
  const [visualizationMode, setVisualizationMode] = useState("2d"); // "2d", "3d", "interactive", "animations"
  const [parameters, setParameters] = useState({ a: 1, b: 0, c: 0 });

  // REACT CONCEPT: Data Organization - Static array for predefined functions wrapped in useMemo
  const predefinedFunctions = useMemo(() => [
    { name: "Quadratic", equation: "x^2", type: "function" },
    { name: "Cubic", equation: "x^3", type: "function" },
    { name: "Sine Wave", equation: "sin(x)", type: "function" },
    { name: "Exponential", equation: "exp(x/2)", type: "function" },
    { name: "Polynomial", equation: "x^3 - 3*x^2 + 2*x", type: "function" },
    { name: "Rational", equation: "1/x", type: "function" },
  ], []);

  // REACT CONCEPT: Data Organization - Parameterized functions for interactive manipulation
  const parameterizedFunctions = useMemo(() => [
    { 
      name: "Quadratic with Parameters", 
      equation: "a*x^2 + b*x + c", 
      parameters: { a: { value: 1, min: -5, max: 5, step: 0.1, label: "Coefficient a", color: "#3b82f6" }, 
                   b: { value: 0, min: -5, max: 5, step: 0.1, label: "Coefficient b", color: "#10b981" }, 
                   c: { value: 0, min: -5, max: 5, step: 0.1, label: "Coefficient c", color: "#f59e0b" } },
      description: "Interactive quadratic function with adjustable coefficients"
    },
    { 
      name: "Sine Wave with Amplitude", 
      equation: "a*sin(b*x + c)", 
      parameters: { a: { value: 1, min: 0, max: 3, step: 0.1, label: "Amplitude", color: "#3b82f6" }, 
                   b: { value: 1, min: 0.1, max: 3, step: 0.1, label: "Frequency", color: "#10b981" }, 
                   c: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1, label: "Phase Shift", color: "#f59e0b" } },
      description: "Adjustable sine wave with amplitude, frequency, and phase controls"
    },
    { 
      name: "Exponential Growth", 
      equation: "a*exp(b*x) + c", 
      parameters: { a: { value: 1, min: 0.1, max: 3, step: 0.1, label: "Base Amplitude", color: "#3b82f6" }, 
                   b: { value: 0.5, min: -1, max: 1, step: 0.05, label: "Growth Rate", color: "#10b981" }, 
                   c: { value: 0, min: -2, max: 2, step: 0.1, label: "Vertical Shift", color: "#f59e0b" } },
      description: "Exponential function with adjustable growth rate and shifts"
    },
    { 
      name: "3D Surface", 
      equation: "a*x^2 + b*y^2 + c*x*y", 
      parameters: { a: { value: 1, min: -2, max: 2, step: 0.1, label: "X² Coefficient", color: "#3b82f6" }, 
                   b: { value: 1, min: -2, max: 2, step: 0.1, label: "Y² Coefficient", color: "#10b981" }, 
                   c: { value: 0, min: -2, max: 2, step: 0.1, label: "XY Coefficient", color: "#f59e0b" } },
      description: "3D surface function for advanced visualization"
    }
  ], []);

  // REACT CONCEPT: Pagination - State management for paginated examples
  const [examplesPage, setExamplesPage] = useState(1);
  const examplesPageSize = 5;
  const totalExamplePages = Math.max(1, Math.ceil(predefinedFunctions.length / examplesPageSize));
  
  // REACT CONCEPT: Performance Optimization - useMemo for paginated examples
  const pagedExamples = useMemo(() => {
    const start = (examplesPage - 1) * examplesPageSize;
    return predefinedFunctions.slice(start, start + examplesPageSize);
  }, [examplesPage, examplesPageSize, predefinedFunctions]);

  // REACT CONCEPT: Component Lifecycle - useEffect for side effects
  useEffect(() => {
    if (examplesPage > totalExamplePages) {
      setExamplesPage(totalExamplePages);
    }
  }, [totalExamplePages, examplesPage]);

  // REACT CONCEPT: Performance Optimization - useCallback for event handlers
  const handleGraphFunction = useCallback(() => {
    setIsGraphing(true);
    setPastCalculations((prev) => [...prev, { id: Date.now(), equation, type: graphType, domain }]);
    setTimeout(() => setIsGraphing(false), 500);
  }, [equation, graphType, domain]);

  // REACT CONCEPT: Event Handling - Reset function for clearing state
  const resetGraph = () => {
    setEquation("x^2");
    setGraphType("function");
    setDomain([-10, 10]);
    setPastCalculations([]);
    setParameters({ a: 1, b: 0, c: 0 });
    setVisualizationMode("2d");
  };

  // REACT CONCEPT: Event Handling - Parameter manipulation
  const handleParameterChange = useCallback((newParameters) => {
    setParameters(newParameters);
  }, []);

  // REACT CONCEPT: Event Handling - Equation updates with parameters
  const handleEquationChange = useCallback((newEquation) => {
    setEquation(newEquation);
  }, []);

  // REACT CONCEPT: Event Handling - Visualization mode switching
  const handleModeChange = useCallback((mode) => {
    setVisualizationMode(mode);
  }, []);

  return (
    <main className="visualization-container">
      <h1>Advanced Function Visualization</h1>
      
      {/* REACT CONCEPT: Conditional Rendering - Visualization Mode Selector */}
      <div className="visualization-modes">
        <button 
          className={`mode-btn ${visualizationMode === "2d" ? "active" : ""}`}
          onClick={() => handleModeChange("2d")}
        >
          <TrendingUp size={16} /> 2D Graphs
        </button>
        <button 
          className={`mode-btn ${visualizationMode === "3d" ? "active" : ""}`}
          onClick={() => handleModeChange("3d")}
        >
          <Box size={16} /> 3D Surfaces
        </button>
        <button 
          className={`mode-btn ${visualizationMode === "interactive" ? "active" : ""}`}
          onClick={() => handleModeChange("interactive")}
        >
          <Sliders size={16} /> Interactive
        </button>
        <button 
          className={`mode-btn ${visualizationMode === "animations" ? "active" : ""}`}
          onClick={() => handleModeChange("animations")}
        >
          <Zap size={16} /> Animations
        </button>
      </div>

      <section className="input-control-panel">
        <div className="function-input">
          <h3><TrendingUp size={20} /> Function Input</h3>
          {/* REACT CONCEPT: Event Handling - Controlled input with onChange */}
          <input type="text" value={equation} onChange={(e) => setEquation(e.target.value)} placeholder="e.g., x^2+2*x+1" aria-label="Equation input" />

          {/* REACT CONCEPT: Lists & Keys - Graph type buttons with proper key management */}
          <div className="graph-type-buttons">
            {["function", "integral", "derivative"].map((type) => (
              <button key={type} onClick={() => setGraphType(type)} aria-pressed={graphType === type} className={graphType === type ? "active" : ""}>
                {type}
              </button>
            ))}
          </div>

          <div className="domain-inputs">
            <input type="number" value={domain[0]} onChange={(e) => setDomain([Number(e.target.value), domain[1]])} aria-label="Domain start" />
            <input type="number" value={domain[1]} onChange={(e) => setDomain([domain[0], Number(e.target.value)])} aria-label="Domain end" />
          </div>

          <button onClick={handleGraphFunction} disabled={isGraphing} className="btn graph-button">
            {isGraphing ? "Graphing..." : <><Play size={16} /> Graph</>}
          </button>

          <button onClick={resetGraph} aria-label="Reset graph" className="btn reset-button">
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="quick-examples">
          <h3>Quick Examples</h3>
          {/* REACT CONCEPT: Lists & Keys - Example buttons with motion animations */}
          {pagedExamples.map((func) => (
            <motion.button key={func.name} onClick={() => { setEquation(func.equation); setGraphType(func.type); }} whileHover={{ scale: 1.05, boxShadow: "0 0 15px var(--accent-secondary)" }} whileFocus={{ scale: 1.05, boxShadow: "0 0 15px var(--accent-secondary)" }}>
              {func.name} ({func.equation})
            </motion.button>
          ))}
          {/* REACT CONCEPT: Pagination - Navigation controls */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem" }}>
            <button type="button" onClick={() => setExamplesPage(Math.max(1, examplesPage - 1))} disabled={examplesPage === 1} className="btn">Prev</button>
            <span style={{ opacity: 0.8 }}>Page {examplesPage} of {totalExamplePages}</span>
            <button type="button" onClick={() => setExamplesPage(Math.min(totalExamplePages, examplesPage + 1))} disabled={examplesPage === totalExamplePages} className="btn">Next</button>
          </div>
        </div>
      </section>

      {/* REACT CONCEPT: Conditional Rendering - Different visualization modes */}
      {visualizationMode === "2d" && (
        <GraphVisualizer equation={equation} type={graphType} domain={domain} />
      )}
      
      {visualizationMode === "3d" && (
        <Plot3D 
          equation={equation} 
          domain={{ x: domain, y: domain }} 
          parameters={parameters}
          onParameterChange={handleParameterChange}
        />
      )}
      
      {visualizationMode === "interactive" && (
        <InteractiveManipulator
          equation={equation}
          parameters={parameters}
          onParameterChange={handleParameterChange}
          onEquationChange={handleEquationChange}
          presetFunctions={parameterizedFunctions}
        />
      )}
      
      {visualizationMode === "animations" && (
        <AnimationSequences />
      )}

      <section className="visualization-features">
        <h3>Advanced Visualization Features:</h3>
        <ul>
          <li><strong>2D Graphs:</strong> Real-time plotting with custom ranges and interactive controls</li>
          <li><strong>3D Surfaces:</strong> Interactive 3D function visualization with rotation and zoom</li>
          <li><strong>Interactive Manipulation:</strong> Drag sliders to see parameter effects in real-time</li>
          <li><strong>Animation Sequences:</strong> Watch mathematical concepts come to life</li>
          <li><strong>Calculus Visualization:</strong> Derivatives, integrals, and critical points</li>
          <li><strong>Supported Functions:</strong> Polynomials, trigonometric, exponential, and more</li>
        </ul>
      </section>

      {/* REACT CONCEPT: Lists & Keys - Past calculations with conditional rendering */}
      <section className="past-calculations">
        <h3>Past Calculations</h3>
        {pastCalculations.length === 0 ? (
          <p>No past calculations yet.</p>
        ) : (
          <ul>
            {pastCalculations.map((calc) => (
              <li key={calc.id}>
                <strong>{calc.equation}</strong> ({calc.type}) • Domain: [{calc.domain[0]}, {calc.domain[1]}]
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default Visualization;
