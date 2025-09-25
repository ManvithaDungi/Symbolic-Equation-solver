const { evaluate, parse, derivative, simplify, solve } = require("mathjs");

const solveMathExpression = (equation) => {
  try {
    const eq = equation.trim();
    if (/derivative/i.test(eq)) return solveDerivative(eq);
    if (/integral/i.test(eq)) return solveIntegral(eq);
    if (/solve/i.test(eq)) return solveEquation(eq);
    if (/limit|lim/i.test(eq)) return solveLimit(eq);
    return simplifyExpression(eq);
  } catch (error) {
    return createErrorResult("general", error);
  }
};

// ------------------ DERIVATIVE ------------------
const solveDerivative = (equation) => {
  try {
    const { func, variable } = parseDerivativeInput(equation);
    const steps = [{ step: 1, description: "Original function", expression: func, explanation: "Starting function" }];
    const result = derivative(parse(func), variable);
    const simplified = simplify(result).toString();
    steps.push({ step: 2, description: "Derivative", expression: simplified, explanation: "Computed derivative" });
    return createSuccessResult(steps, simplified, "derivative");
  } catch (error) {
    return createErrorResult("derivative", error);
  }
};

const parseDerivativeInput = (eq) => {
  const m = eq.match(/derivative\s*\(\s*(.+?)\s*,\s*(\w+)\s*\)/i);
  if (!m) throw new Error("Invalid derivative syntax. Use derivative(expression, variable)");
  return { func: m[1], variable: m[2] };
};

// ------------------ INTEGRAL ------------------
const solveIntegral = (equation) => {
  try {
    const { func, variable } = parseIntegralInput(equation);
    const steps = [{ step: 1, description: "Integral setup", expression: func, explanation: "Setup integral" }];
    let result;

    if (/x\^(\d+)/.test(func)) {
      const [_, n] = func.match(/x\^(\d+)/);
      const coeff = 1 / (parseInt(n) + 1);
      result = `${coeff}*${variable}^${parseInt(n) + 1} + C`;
    } else result = `∫${func} d${variable} + C`;

    steps.push({ step: 2, description: "Integral result", expression: result, explanation: "Computed integral" });
    return createSuccessResult(steps, result, "integral");
  } catch (error) {
    return createErrorResult("integral", error);
  }
};

const parseIntegralInput = (eq) => {
  const m = eq.match(/integral\s*\(\s*(.+?)\s*,\s*(\w+)\s*\)/i);
  if (!m) throw new Error("Invalid integral syntax. Use integral(expression, variable)");
  return { func: m[1], variable: m[2] };
};

// ------------------ EQUATION ------------------
const solveEquation = (equation) => {
  try {
    const { expr, variable } = parseSolveInput(equation);
    const steps = [{ step: 1, description: "Original equation", expression: expr, explanation: "Setup equation" }];
    const solutions = solve(expr, variable);
    steps.push({ step: 2, description: "Solutions", expression: solutions.join(", "), explanation: "Solved equation" });
    return createSuccessResult(steps, `${variable} = ${solutions.join(", ")}`, "equation");
  } catch (error) {
    return createErrorResult("equation", error);
  }
};

const parseSolveInput = (eq) => {
  let match = eq.match(/solve\s*\(\s*(.+?)\s*,\s*(\w+)\s*\)/i);
  if (match) return { expr: match[1].trim(), variable: match[2].trim() };

  match = eq.match(/solve\s*\(\s*(.+?)\s*=\s*(.+?)\s*,\s*(\w+)\s*\)/i);
  if (match) {
    const left = match[1].trim(), right = match[2].trim(), variable = match[3].trim();
    return { expr: right === "0" ? left : `${left} - (${right})`, variable };
  }

  throw new Error("Invalid solve syntax. Use solve(expression, variable) or solve(equation = value, variable)");
};

// ------------------ LIMIT ------------------
const solveLimit = (equation) => {
  try {
    const { func, variable, approach } = parseLimitInput(equation);
    const steps = [{ step: 1, description: "Limit setup", expression: `${func} as ${variable}->${approach}`, explanation: "Setup limit" }];
    const substituted = func.replace(new RegExp(variable, "g"), `(${approach})`);
    const result = evaluate(substituted);
    steps.push({ step: 2, description: "Limit evaluation", expression: result.toString(), explanation: "Evaluated limit" });
    return createSuccessResult(steps, result.toString(), "limit");
  } catch (error) {
    return createErrorResult("limit", error);
  }
};

const parseLimitInput = (eq) => {
  const m = eq.match(/limit\s*\(\s*(\w+)\s*,\s*([^,]+)\s*,\s*(.+?)\s*\)/i);
  if (!m) throw new Error("Invalid limit syntax. Use limit(variable, approach, function)");
  return { variable: m[1], approach: m[2], func: m[3] };
};

// ------------------ SIMPLIFY ------------------
const simplifyExpression = (equation) => {
  try {
    const steps = [{ step: 1, description: "Original expression", expression: equation, explanation: "Simplify expression" }];
    const simplified = simplify(parse(equation)).toString();
    steps.push({ step: 2, description: "Simplified", expression: simplified, explanation: "Simplified algebraically" });
    return createSuccessResult(steps, simplified, "simplification");
  } catch (error) {
    return createErrorResult("simplification", error);
  }
};

// ------------------ UTILITY ------------------
const createSuccessResult = (steps, finalAnswer, type) => ({ steps, finalAnswer, type, success: true });
const createErrorResult = (type, error) => ({ steps: [], finalAnswer: "", type, success: false, error: error.message || String(error) });
const validateMathExpression = (expression) => { try { parse(expression); return { valid: true }; } catch (e) { return { valid: false, error: e.message }; } };
const getExpressionType = (expression) => {
  if (/derivative/i.test(expression)) return "derivative";
  if (/integral/i.test(expression)) return "integral";
  if (/solve/i.test(expression)) return "equation";
  if (/limit|lim/i.test(expression)) return "limit";
  return "simplification";
};

module.exports = { solveMathExpression, validateMathExpression, getExpressionType };
