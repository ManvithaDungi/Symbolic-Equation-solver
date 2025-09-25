// src/pages/Solver.js
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Calculator, Zap, CheckCircle, AlertCircle, Copy } from "lucide-react";
import "./Solver.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const EquationInput = ({ onSolve, isLoading }) => {
  const [equation, setEquation] = useState("");
  const exampleEquations = [
    "x^2 + 2*x + 1",
    "derivative(x^3 + 2*x^2, x)",
    "integral(x^2, x)",
    "solve(x^2 - 4, x)",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (equation.trim()) onSolve(equation.trim());
  };

  return (
    <div className="equation-input-container">
      <h2>Enter Your Equation</h2>
      <p>Type mathematical expressions using standard notation</p>

      <form onSubmit={handleSubmit}>
        <div className="input-with-icon">
          <input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="e.g., x^2 + 2*x + 1 or derivative(x^3, x)"
            disabled={isLoading}
            aria-label="Equation input"
          />
          <Calculator size={20} aria-hidden="true" className="input-icon" />
        </div>

        <button type="submit" disabled={!equation.trim() || isLoading}>
          {isLoading ? "Solving..." : <><Zap size={16} /> Solve Equation</>}
        </button>
      </form>

      <div className="quick-examples">
        <p>Quick Examples:</p>
        {exampleEquations.map((example, i) => (
          <button
            key={i}
            onClick={() => setEquation(example)}
            disabled={isLoading}
            type="button"
            className="example-button"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
};

const SolverOutput = ({ equation, result }) => {
  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  if (!result) {
    return (
      <div className="solver-output-container no-result">
        <Calculator size={32} aria-hidden="true" />
        <p>Enter an equation above to see the step-by-step solution</p>
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="solver-output-container error-state" role="alert">
        <AlertCircle size={20} aria-hidden="true" />
        <h3>Error Solving Equation</h3>
        <p>{result.error || "Unable to solve this equation"}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="solver-output-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section aria-labelledby="solution-title">
        <div className="solution-header">
          <CheckCircle size={20} aria-hidden="true" />
          <div>
            <h3 id="solution-title">Solution</h3>
            <p>Input: {equation}</p>
          </div>
          <span aria-label={`Solution type is ${result.type}`}>{result.type}</span>
        </div>

        <div className="steps-section" aria-label="Step-by-step solution">
          <h4>Step-by-Step Solution:</h4>
          {result.steps.map((step) => (
            <motion.div
              key={step.step}
              className="step-block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: step.step * 0.1 }}
            >
              <div className="step-header">
                <h5>
                  Step {step.step}: {step.description}
                </h5>
                <button
                  onClick={() => copyToClipboard(step.expression)}
                  aria-label={`Copy expression from step ${step.step}`}
                >
                  <Copy size={14} />
                </button>
              </div>
              <div className="step-expression">{step.expression}</div>
              {step.explanation && <p className="step-explanation">{step.explanation}</p>}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="final-answer"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          aria-label="Final answer"
          tabIndex={0}
        >
          <h4>Final Answer:</h4>
          <div>{result.finalAnswer}</div>
          <button onClick={() => copyToClipboard(result.finalAnswer)} aria-label="Copy final answer">
            <Copy size={14} /> Copy
          </button>
        </motion.div>
      </section>
    </motion.div>
  );
};

const Solver = () => {
  const [currentEquation, setCurrentEquation] = useState("");
  const [solution, setSolution] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSolveEquation = useCallback(async (equation) => {
    setIsLoading(true);
    setCurrentEquation(equation);
    try {
      const response = await fetch(`${API_BASE_URL}/api/math/solve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expression: equation }),
      });

      const result = await response.json();
      setSolution(result);
    } catch (err) {
      setSolution({ success: false, error: err.message });
    }
    setIsLoading(false);
  }, []);

  return (
    <main className="solver-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1>Mathematical Equation Solver</h1>
        <p>Enter expressions and get step-by-step solutions.</p>

        <EquationInput onSolve={handleSolveEquation} isLoading={isLoading} />
        <SolverOutput equation={currentEquation} result={solution} />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <h3>Supported Operations:</h3>
          <div className="supported-ops-container">
            <div className="ops-category">
              <div className="category-title">Basic Operations:</div>
              <ul>
                <li>2 + 3</li>
                <li>5 - 2</li>
                <li>3 * 4</li>
                <li>8 / 2</li>
                <li>x^2, x^3</li>
              </ul>
            </div>
            <div className="ops-category">
              <div className="category-title">Advanced Operations:</div>
              <ul>
                <li>derivative(x^3, x)</li>
                <li>integral(x^2, x)</li>
                <li>solve(x^2 - 4, x)</li>
                <li>sin(x), cos(x), ln(x)</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default Solver;
//math/src/pages/Solver.js
//this is my frontend react code