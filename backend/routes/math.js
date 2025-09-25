// backend/routes/math.js
const express = require("express");
const router = express.Router();
const { solveMathExpression } = require("../utils/mathSolver");

router.post("/solve", (req, res) => {
  const { expression } = req.body;
  if(!expression) return res.status(400).json({success:false,error:"Expression is required"});
  const result = solveMathExpression(expression);
  res.json(result);
});

module.exports = router;
