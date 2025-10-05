// backend/routes/math.js 
const express = require('express');
const { solveMathExpression, validateMathExpression, getExpressionType } = require("../utils/mathSolver");
const router = express.Router();

// POST /api/solve - Main solving endpoint
router.post("/solve", (req, res) => {
  try {
    const { expression } = req.body;
    
    // Validate input
    if (!expression) {
      return res.status(400).json({
        success: false,
        error: "Expression is required",
        type: "validation"
      });
    }

    // Validate expression syntax
    const validation = validateMathExpression(expression);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
        type: "validation"
      });
    }

    // Get expression type
    const expressionType = getExpressionType(expression);
    
    // Solve the expression
    const result = solveMathExpression(expression);
    
    // Add additional metadata
    result.inputExpression = expression;
    result.detectedType = expressionType;
    
    res.json(result);
    
  } catch (error) {
    console.error('Math solving error:', error);
    res.status(500).json({
      success: false,
      error: "Internal server error while solving expression",
      type: "server",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /examples - Get example expressions
router.get('/examples', (req, res) => {
  const examples = {
    basic: [
      "2 + 3 * 4",
      "sin(pi/2)",
      "log(10)",
      "sqrt(16)",
      "x^2 + 2*x + 1"
    ],
    calculus: [
      "derivative(x^3 + 2*x^2, x)",
      "integral(x^2, x)",
      "limit(x, 0, sin(x)/x)"
    ],
    algebra: [
      "solve(x^2 - 4 = 0, x)",
      "solve(2*x + 3 = 7, x)",
      "solve(x^2 + x - 6 = 0, x)"
    ]
  };
  
  res.json({
    success: true,
    examples
  });
});

// POST /validate - Validate expression syntax
router.post('/validate', (req, res) => {
  try {
    const { expression } = req.body;
    
    if (!expression) {
      return res.status(400).json({
        valid: false,
        error: "Expression is required"
      });
    }

    const result = validateMathExpression(expression);
    const type = result.valid ? getExpressionType(expression) : null;
    
    res.json({
      ...result,
      type
    });
    
  } catch (error) {
    res.status(500).json({
      valid: false,
      error: "Server error during validation"
    });
  }
});

module.exports = router;