// src/pages/Visualization.js
import React, { useState, useCallback, useMemo, useEffect } from "react";
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, BarChart3, Play, RotateCcw } from "lucide-react";
import { evaluate } from "mathjs";
import { motion } from "framer-motion";
import "./Visualization.css";

// Chart renderer for provided equation, type and domain
const GraphVisualizer = ({ equation, type = "function", domain = [-10, 10] }) => {
  // Build graph points once inputs change
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

  const getChartTitle = () => {
    switch (type) {
      case "integral":
        return "Integral Visualization";
      case "derivative":
        return "Derivative Visualization";
      default:
        return "Function Graph";
    }
  };

  const getChartColor = () => {
    switch (type) {
      case "integral":
        return "#10b981";
      case "derivative":
        return "#f59e0b";
      default:
        return "#3b82f6";
    }
  };

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

GraphVisualizer.propTypes = {
  equation: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["function", "integral", "derivative"]),
  domain: PropTypes.arrayOf(PropTypes.number),
};

GraphVisualizer.defaultProps = {
  type: "function",
  domain: [-10, 10],
};

// Main page component for function visualization
const Visualization = () => {
  const [equation, setEquation] = useState("x^2");
  const [graphType, setGraphType] = useState("function");
  const [domain, setDomain] = useState([-10, 10]);
  const [isGraphing, setIsGraphing] = useState(false);

  // NEW: Past calculations state
  const [pastCalculations, setPastCalculations] = useState([]);

  // List of quick example functions
  const predefinedFunctions = [
    { name: "Quadratic", equation: "x^2", type: "function" },
    { name: "Cubic", equation: "x^3", type: "function" },
    { name: "Sine Wave", equation: "sin(x)", type: "function" },
    { name: "Exponential", equation: "exp(x/2)", type: "function" },
    { name: "Polynomial", equation: "x^3 - 3*x^2 + 2*x", type: "function" },
    { name: "Rational", equation: "1/x", type: "function" },
  ];

  // Pagination for examples
  const [examplesPage, setExamplesPage] = useState(1);
  const examplesPageSize = 5;
  const totalExamplePages = Math.max(1, Math.ceil(predefinedFunctions.length / examplesPageSize));
  const pagedExamples = useMemo(() => {
    const start = (examplesPage - 1) * examplesPageSize;
    return predefinedFunctions.slice(start, start + examplesPageSize);
  }, [examplesPage, predefinedFunctions.length]);

  // Clamp page index if total pages change
  useEffect(() => {
    if (examplesPage > totalExamplePages) {
      setExamplesPage(totalExamplePages);
    }
  }, [totalExamplePages, examplesPage]);

  // Simulate a brief graphing state and store calculation
  const handleGraphFunction = useCallback(() => {
    setIsGraphing(true);
    setPastCalculations((prev) => [
      ...prev,
      { id: Date.now(), equation, type: graphType, domain },
    ]);
    setTimeout(() => setIsGraphing(false), 500);
  }, [equation, graphType, domain]);

  // Reset inputs and history
  const resetGraph = () => {
    setEquation("x^2");
    setGraphType("function");
    setDomain([-10, 10]);
    setPastCalculations([]);
  };

  return (
    <main className="visualization-container">
      <h1>Function Visualization</h1>

      <section className="input-control-panel">
        <div className="function-input">
          <h3>
            <TrendingUp size={20} /> Function Input
          </h3>
          <input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="e.g., x^2+2*x+1"
            aria-label="Equation input"
          />

          <div className="graph-type-buttons">
            {["function", "integral", "derivative"].map((type) => (
              <button
                key={type}
                onClick={() => setGraphType(type)}
                aria-pressed={graphType === type}
                className={graphType === type ? "active" : ""}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="domain-inputs">
            <input
              type="number"
              value={domain[0]}
              onChange={(e) => setDomain([Number(e.target.value), domain[1]])}
              aria-label="Domain start"
            />
            <input
              type="number"
              value={domain[1]}
              onChange={(e) => setDomain([domain[0], Number(e.target.value)])}
              aria-label="Domain end"
            />
          </div>

          <button onClick={handleGraphFunction} disabled={isGraphing} className="btn graph-button">
            {isGraphing ? (
              "Graphing..."
            ) : (
              <>
                <Play size={16} /> Graph
              </>
            )}
          </button>

          <button onClick={resetGraph} aria-label="Reset graph" className="btn reset-button">
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="quick-examples">
          <h3>Quick Examples</h3>
          {pagedExamples.map((func) => (
            <motion.button
              key={func.name}
              onClick={() => {
                setEquation(func.equation);
                setGraphType(func.type);
              }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px var(--accent-secondary)" }}
              whileFocus={{ scale: 1.05, boxShadow: "0 0 15px var(--accent-secondary)" }}
            >
              {func.name} ({func.equation})
            </motion.button>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem" }}>
            <button
              type="button"
              onClick={() => setExamplesPage(Math.max(1, examplesPage - 1))}
              disabled={examplesPage === 1}
              className="btn"
            >
              Prev
            </button>
            <span style={{ opacity: 0.8 }}>
              Page {examplesPage} of {totalExamplePages}
            </span>
            <button
              type="button"
              onClick={() => setExamplesPage(Math.min(totalExamplePages, examplesPage + 1))}
              disabled={examplesPage === totalExamplePages}
              className="btn"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <GraphVisualizer equation={equation} type={graphType} domain={domain} />

      <section className="visualization-features">
        <h3>Visualization Features:</h3>
        <ul>
          <li>Function Graphs: real-time, custom ranges, interactive</li>
          <li>Calculus Visualization: derivatives, integrals, critical points</li>
          <li>Supported: polynomials, trig, exponential</li>
        </ul>
      </section>

      {/* NEW: Past Calculations List */}
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
