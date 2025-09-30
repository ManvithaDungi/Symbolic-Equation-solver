// frontend/src/pages/Solver.js
import React, { Component } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

import { Calculator, Zap, CheckCircle, AlertCircle, Copy } from "lucide-react";
import "./Solver.css";

// ---------------- Equation Input with Formik ----------------
const EquationInput = ({ onSolve, isLoading }) => {
  const exampleEquations = [
    "x^2 + 2*x + 1",
    "derivative(x^3 + 2*x^2, x)",
    "integral(x^2, x)",
    "solve(x^2 - 4 = 0, x)",
    "2 + 3 * 4",
    "sin(pi/2)",
  ];

  const formik = useFormik({
    initialValues: { equation: "" },
    validationSchema: Yup.object({
      equation: Yup.string()
        .trim()
        .required("Equation is required")
        .min(2, "Too short!"),
    }),
    onSubmit: (values) => {
      onSolve(values.equation.trim());
    },
  });

  const setExample = (example) => {
    formik.setFieldValue("equation", example);
  };

  return (
    <div className="equation-input-container">
      <h2>Enter Your Equation</h2>
      <p>Type mathematical expressions using standard notation</p>

      <form onSubmit={formik.handleSubmit}>
        <div className="input-with-icon">
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            name="equation"
            value={formik.values.equation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="e.g., x^2 + 2*x + 1 or derivative(x^3, x)"
            disabled={isLoading}
            aria-label="Equation input"
            error={formik.touched.equation && Boolean(formik.errors.equation)}
            helperText={formik.touched.equation && formik.errors.equation}
            InputProps={{
              endAdornment: (
                <Calculator size={20} aria-hidden="true" className="input-icon" />
              ),
            }}
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!formik.isValid || isLoading}
          style={{ marginTop: "1rem" }}
        >
          {isLoading ? "Solving..." : <><Zap size={16} /> Solve Equation</>}
        </Button>
      </form>

      <div className="quick-examples">
        <p>Quick Examples:</p>
        {exampleEquations.map((example, i) => (
          <button
            key={i}
            onClick={() => setExample(example)}
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

EquationInput.propTypes = {
  onSolve: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

EquationInput.defaultProps = {
  isLoading: false,
};

// ---------------- Solver Output ----------------
class SolverOutput extends Component {
  constructor(props) {
    super(props);
    this.state = { currentPage: 1, pageSize: 5 };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.equation !== this.props.equation) {
      this.setState({ currentPage: 1 });
    }
  }

  copyToClipboard = (text) => navigator.clipboard.writeText(text);

  changePage = (delta) => {
    const total = this.getTotalPages();
    this.setState((s) => {
      const next = Math.min(Math.max(s.currentPage + delta, 1), total);
      return { currentPage: next };
    });
  };

  getTotalPages = () => {
    const totalSteps = this.props.result?.steps?.length || 0;
    return Math.max(1, Math.ceil(totalSteps / this.state.pageSize));
  };

  getPagedSteps = () => {
    const steps = this.props.result?.steps || [];
    const start = (this.state.currentPage - 1) * this.state.pageSize;
    return steps.slice(start, start + this.state.pageSize);
  };

  render() {
    const { equation, result } = this.props;

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
          <small>Try simpler expressions or check syntax</small>
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
            <span aria-label={`Solution type is ${result.type}`} className="solution-type">
              {result.type}
            </span>
          </div>

          {result.steps && result.steps.length > 0 && (
            <div className="steps-section" aria-label="Step-by-step solution">
              <h4>Step-by-Step Solution:</h4>
              {this.getPagedSteps().map((step) => (
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
                      onClick={() => this.copyToClipboard(step.expression)}
                      aria-label={`Copy expression from step ${step.step}`}
                      className="copy-btn"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  <div className="step-expression">{step.expression}</div>
                  {step.explanation && (
                    <p className="step-explanation">{step.explanation}</p>
                  )}
                </motion.div>
              ))}
              <div className="pagination-controls" style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem" }}>
                <button type="button" onClick={() => this.changePage(-1)} disabled={this.state.currentPage === 1} className="copy-btn">Prev</button>
                <span style={{ opacity: 0.8 }}>Page {this.state.currentPage} of {this.getTotalPages()}</span>
                <button type="button" onClick={() => this.changePage(1)} disabled={this.state.currentPage === this.getTotalPages()} className="copy-btn">Next</button>
              </div>
            </div>
          )}

          <motion.div
            className="final-answer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            aria-label="Final answer"
            tabIndex={0}
          >
            <h4>Final Answer:</h4>
            <div className="answer-content">{result.finalAnswer}</div>
            <button
              onClick={() => this.copyToClipboard(result.finalAnswer)}
              aria-label="Copy final answer"
              className="copy-btn"
            >
              <Copy size={14} /> Copy
            </button>
          </motion.div>
        </section>
      </motion.div>
    );
  }
}

SolverOutput.propTypes = {
  equation: PropTypes.string.isRequired,
  result: PropTypes.shape({
    success: PropTypes.bool,
    error: PropTypes.string,
    type: PropTypes.string,
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        step: PropTypes.number,
        description: PropTypes.string,
        expression: PropTypes.string,
        explanation: PropTypes.string,
      })
    ),
    finalAnswer: PropTypes.string,
  }),
};

SolverOutput.defaultProps = {
  result: null,
};

// ---------------- Main Solver Page ----------------
class Solver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEquation: "",
      solution: null,
      isLoading: false,
    };
  }

  handleSolveEquation = async (equation) => {
    this.setState({ isLoading: true, currentEquation: equation });
    try {
      const response = await axios.post("/api/solve", { expression: equation });
      this.setState({ solution: response.data });
    } catch (err) {
      this.setState({
        solution: {
          success: false,
          error: err.response?.data?.error || "Failed to solve equation",
          type: "error",
        },
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { currentEquation, solution, isLoading } = this.state;
    return (
      <main className="solver-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1>Mathematical Equation Solver</h1>
          <p>Enter expressions and get step-by-step solutions.</p>

          <EquationInput onSolve={this.handleSolveEquation} isLoading={isLoading} />
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
                  <li>sin(x), cos(x), tan(x)</li>
                  <li>ln(x), log(x)</li>
                </ul>
              </div>
              <div className="ops-category">
                <div className="category-title">Advanced Operations:</div>
                <ul>
                  <li>derivative(x^3, x)</li>
                  <li>integral(x^2, x)</li>
                  <li>solve(x^2 - 4 = 0, x)</li>
                  <li>limit(x, 0, sin(x)/x)</li>
                  <li>simplify(x^2 + 2*x + 1)</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    );
  }
}

export default Solver;
