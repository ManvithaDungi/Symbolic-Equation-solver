const express = require("express");
const router = express.Router();
const {
  solveMathExpression,
  validateMathExpression,
  getExpressionType,
} = require("../utils/mathSolver");

// POST /api/solve
router.post("/solve", (req, res) => {
  try {
    const { expression } = req.body;
    if (!expression) {
      return res.status(400).json({ success: false, error: "Expression is required", type: "validation" });
    }

    const validation = validateMathExpression(expression);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error, type: "validation" });
    }

    const expressionType = getExpressionType(expression);
    const result = solveMathExpression(expression);
    result.inputExpression = expression;
    result.detectedType = expressionType;

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error", type: "server", details: error.message });
  }
});

// POST /api/validate
router.post("/validate", (req, res) => {
  try {
    const { expression } = req.body;
    if (!expression) return res.status(400).json({ valid: false, error: "Expression is required" });

    const validation = validateMathExpression(expression);
    const type = validation.valid ? getExpressionType(expression) : null;
    res.json({ ...validation, type });
  } catch (error) {
    res.status(500).json({ valid: false, error: "Server error during validation" });
  }
});

// GET /api/examples
router.get("/examples", (req, res) => {
  const examples = {
    basic: ["2 + 3 * 4", "sin(pi/2)", "log(10)", "sqrt(16)", "x^2 + 2*x + 1"],
    calculus: ["derivative(x^3 + 2*x^2, x)", "integral(x^2, x)", "limit(x, 0, sin(x)/x)"],
    algebra: ["solve(x^2 - 4 = 0, x)", "solve(2*x + 3 = 7, x)", "solve(x^2 + x - 6 = 0, x)"],
  };
  res.json({ success: true, examples });
});

module.exports = router;
