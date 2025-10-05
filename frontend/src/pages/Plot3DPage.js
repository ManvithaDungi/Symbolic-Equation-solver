// frontend/src/pages/Plot3DPage.js
// REACT CONCEPTS USED:
// - Functional Component with Hooks (useState, useCallback, useMemo)
// - State Management (multiple useState hooks for different UI states)
// - Event Handling (parameter changes, equation updates, preset selection)
// - Performance Optimization (useCallback for event handlers, useMemo for expensive calculations)
// - Component Composition (Plot3D as child component)
// - Conditional Rendering (different plot types and error states)
// - Lists & Keys (mapping over presets and examples)

import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Box, RotateCcw, Zap, Calculator, Settings, Eye, EyeOff } from 'lucide-react';
import Plot3D from '../components/Plot3D';
import './Plot3DPage.css';

const Plot3DPage = () => {
  // REACT CONCEPT: State Management - Multiple useState hooks for different UI states
  const [equation, setEquation] = useState("x^2 + y^2");
  const [domain, setDomain] = useState({ x: [-5, 5], y: [-5, 5] });
  const [parameters, setParameters] = useState({ a: 1, b: 1, c: 0 });
  const [showControls, setShowControls] = useState(true);
  const [plotType, setPlotType] = useState("surface"); // "surface", "wireframe", "points"

  // REACT CONCEPT: Data Organization - Static array for 3D function presets
  const presetFunctions = useMemo(() => [
    {
      name: "Paraboloid",
      equation: "x^2 + y^2",
      description: "Classic 3D paraboloid surface",
      parameters: { a: 1, b: 1, c: 0 },
      domain: { x: [-3, 3], y: [-3, 3] }
    },
    {
      name: "Hyperbolic Paraboloid",
      equation: "x^2 - y^2",
      description: "Saddle-shaped surface",
      parameters: { a: 1, b: -1, c: 0 },
      domain: { x: [-3, 3], y: [-3, 3] }
    },
    {
      name: "Sphere",
      equation: "sqrt(4 - x^2 - y^2)",
      description: "Upper hemisphere",
      parameters: { a: 2, b: 2, c: 0 },
      domain: { x: [-1.8, 1.8], y: [-1.8, 1.8] }
    },
    {
      name: "Sine Wave Surface",
      equation: "sin(sqrt(x^2 + y^2))",
      description: "Radial sine wave pattern",
      parameters: { a: 1, b: 1, c: 0 },
      domain: { x: [-6, 6], y: [-6, 6] }
    },
    {
      name: "Exponential Surface",
      equation: "exp(-(x^2 + y^2)/4)",
      description: "Gaussian-like exponential surface",
      parameters: { a: 1, b: 1, c: 0 },
      domain: { x: [-4, 4], y: [-4, 4] }
    },
    {
      name: "Ripple Surface",
      equation: "sin(x) * cos(y)",
      description: "Intersecting sine and cosine waves",
      parameters: { a: 1, b: 1, c: 0 },
      domain: { x: [-4, 4], y: [-4, 4] }
    },
    {
      name: "Parametric Surface",
      equation: "1*x^2 + 1*y^2 + 0*x*y",
      description: "Customizable quadratic surface",
      parameters: { a: 1, b: 1, c: 0 },
      domain: { x: [-3, 3], y: [-3, 3] }
    },
    {
      name: "Mountain Range",
      equation: "sin(x/2) * cos(y/2) + 0.5*sin(x) * sin(y)",
      description: "Complex mountainous terrain",
      parameters: { a: 1, b: 1, c: 0 },
      domain: { x: [-6, 6], y: [-6, 6] }
    }
  ], []);

  // REACT CONCEPT: Event Handling - useCallback for performance optimization
  const handleParameterChange = useCallback((newParameters) => {
    setParameters(newParameters);
  }, []);

  const handleEquationChange = useCallback((newEquation) => {
    setEquation(newEquation);
  }, []);

  const handleDomainChange = useCallback((axis, newRange) => {
    setDomain(prev => ({
      ...prev,
      [axis]: newRange
    }));
  }, []);

  const handlePresetSelect = useCallback((preset) => {
    setEquation(preset.equation);
    setParameters(preset.parameters);
    setDomain(preset.domain);
    setPlotType("surface"); // Reset plot type when selecting preset
  }, []);

  const handleReset = useCallback(() => {
    setEquation("x^2 + y^2");
    setDomain({ x: [-5, 5], y: [-5, 5] });
    setParameters({ a: 1, b: 1, c: 0 });
    setPlotType("surface");
  }, []);

  // REACT CONCEPT: Helper Functions - Domain input component
  const DomainInput = ({ axis, range, onChange }) => (
    <div className="domain-input">
      <label>{axis.toUpperCase()} Range:</label>
      <div className="range-inputs">
        <input
          type="number"
          value={range[0]}
          onChange={(e) => onChange(axis, [parseFloat(e.target.value), range[1]])}
          step="0.5"
          className="range-input"
        />
        <span>to</span>
        <input
          type="number"
          value={range[1]}
          onChange={(e) => onChange(axis, [range[0], parseFloat(e.target.value)])}
          step="0.5"
          className="range-input"
        />
      </div>
    </div>
  );

  return (
    <main className="plot3d-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>
          <Box size={32} />
          3D Function Visualization
        </h1>
        <p>Explore mathematical functions in three dimensions with interactive controls</p>
      </motion.div>

      <div className="plot3d-layout">
        {/* REACT CONCEPT: Conditional Rendering - Control Panel */}
        {showControls && (
          <motion.aside
            className="control-panel"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="panel-header">
              <h3><Settings size={20} /> Controls</h3>
              <button
                className="toggle-btn"
                onClick={() => setShowControls(false)}
                title="Hide Controls"
              >
                <EyeOff size={16} />
              </button>
            </div>

            <div className="control-section">
              <h4>Function Equation</h4>
              <input
                type="text"
                value={equation}
                onChange={(e) => handleEquationChange(e.target.value)}
                className="equation-input"
                placeholder="Enter 3D function (e.g., x^2 + y^2)"
              />
            </div>

            <div className="control-section">
              <h4>Domain Settings</h4>
              <DomainInput axis="x" range={domain.x} onChange={handleDomainChange} />
              <DomainInput axis="y" range={domain.y} onChange={handleDomainChange} />
            </div>

            <div className="control-section">
              <h4>Plot Type</h4>
              <div className="plot-type-buttons">
                {["surface", "wireframe", "points"].map((type) => (
                  <button
                    key={type}
                    className={`plot-type-btn ${plotType === type ? 'active' : ''}`}
                    onClick={() => setPlotType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-section">
              <h4>Quick Actions</h4>
              <button className="action-btn reset-btn" onClick={handleReset}>
                <RotateCcw size={16} />
                Reset View
              </button>
            </div>
          </motion.aside>
        )}

        {/* REACT CONCEPT: Conditional Rendering - Show Controls Button */}
        {!showControls && (
          <motion.button
            className="show-controls-btn"
            onClick={() => setShowControls(true)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Eye size={16} />
            Show Controls
          </motion.button>
        )}

        {/* REACT CONCEPT: Component Composition - Main 3D Plot Area */}
        <motion.div
          className="plot-area"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="plot-info" style={{ 
            marginBottom: '1rem', 
            padding: '0.5rem', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '0.25rem',
            fontSize: '0.875rem'
          }}>
            <strong>Current Equation:</strong> {equation}<br/>
            <strong>Domain:</strong> X: [{domain.x[0]}, {domain.x[1]}], Y: [{domain.y[0]}, {domain.y[1]}]
          </div>
          <Plot3D
            equation={equation}
            domain={domain}
            parameters={parameters}
            onParameterChange={handleParameterChange}
            plotType={plotType}
          />
        </motion.div>
      </div>

      {/* REACT CONCEPT: Lists & Keys - Preset Functions */}
      <motion.section
        className="presets-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3><Zap size={20} /> Function Presets</h3>
        <p>Click on any preset to instantly visualize the function</p>
        
        <div className="presets-grid">
          {presetFunctions.map((preset, index) => (
            <motion.button
              key={index}
              className="preset-card"
              onClick={() => handlePresetSelect(preset)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="preset-header">
                <h4>{preset.name}</h4>
                <Calculator size={16} />
              </div>
              <div className="preset-equation">{preset.equation}</div>
              <div className="preset-description">{preset.description}</div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* REACT CONCEPT: Conditional Rendering - Help Section */}
      <motion.section
        className="help-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3>3D Visualization Help</h3>
        <div className="help-grid">
          <div className="help-item">
            <h4>Mouse Controls</h4>
            <ul>
              <li><strong>Left Click + Drag:</strong> Rotate the 3D view</li>
              <li><strong>Right Click + Drag:</strong> Pan the view</li>
              <li><strong>Scroll Wheel:</strong> Zoom in/out</li>
            </ul>
          </div>
          <div className="help-item">
            <h4>Function Syntax</h4>
            <ul>
              <li>Use <code>x</code> and <code>y</code> as variables</li>
              <li>Supported: <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>^</code></li>
              <li>Functions: <code>sin</code>, <code>cos</code>, <code>exp</code>, <code>sqrt</code>, <code>log</code></li>
            </ul>
          </div>
          <div className="help-item">
            <h4>Tips</h4>
            <ul>
              <li>Start with preset functions to see examples</li>
              <li>Adjust domain ranges for better visualization</li>
              <li>Try different plot types for various effects</li>
              <li>Use parameters for interactive exploration</li>
            </ul>
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default Plot3DPage;
