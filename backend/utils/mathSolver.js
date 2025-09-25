// backend/utils/mathSolver.js
const { evaluate, parse, derivative, simplify, solve } = require("mathjs");

const solveMathExpression = (equation) => {
  try {
    const cleanEquation = equation.trim();

    if (isDerivativeOperation(cleanEquation)) return solveDerivative(cleanEquation);
    if (isIntegralOperation(cleanEquation)) return solveIntegral(cleanEquation);
    if (isSolveOperation(cleanEquation)) return solveMathEquation(cleanEquation);
    if (isLimitOperation(cleanEquation)) return solveLimit(cleanEquation);
    return simplifyExpression(cleanEquation);
  } catch (error) {
    return createErrorResult("general", error);
  }
};

const isDerivativeOperation = (eq) => /\b(derivative|diff|d\/d|differentiate)\b/i.test(eq);
const isIntegralOperation = (eq) => /\b(integral|integrate|∫)\b/i.test(eq);
const isSolveOperation = (eq) => /\b(solve)\s*\(/i.test(eq);
const isLimitOperation = (eq) => /\b(limit|lim)\b/i.test(eq);

const solveDerivative = (equation) => {
  try {
    const { func, variable } = parseDerivativeInput(equation);
    const steps = [];
    
    steps.push(createStep(1, "Original function", `f(${variable}) = ${func}`, "Starting with the given function"));
    
    const parsed = parse(func);
    const derivativeResult = derivative(parsed, variable);
    const simplified = simplify(derivativeResult);
    
    addDerivativeRules(steps, func, variable);
    steps.push(createStep(steps.length + 1, "Apply differentiation", `f'(${variable}) = ${simplified.toString()}`, "Computing the derivative"));
    
    return createSuccessResult(steps, simplified.toString(), "derivative");
  } catch (error) {
    return createErrorResult("derivative", error);
  }
};

const solveIntegral = (equation) => {
  try {
    const { func, variable } = parseIntegralInput(equation);
    const steps = [createStep(1, "Setup integral", `∫ ${func} d${variable}`, "Setting up the integral")];
    
    const result = solveIntegralByPattern(func, variable, steps);
    return createSuccessResult(steps, result, "integral");
  } catch (error) {
    return createErrorResult("integral", error);
  }
};

const solveMathEquation = (equation) => {
  try {
    const { expr, variable } = parseSolveInput(equation);
    const steps = [createStep(1, "Original equation", expr, "Starting equation to solve")];
    
    try {
      // Try to use mathjs solve function
      const solutions = solve(expr, variable);
      
      if (Array.isArray(solutions)) {
        steps.push(createStep(2, "Apply solving methods", `Solutions for ${variable}`, "Finding all solutions"));
        const solutionStr = solutions.map(sol => {
          if (typeof sol === 'object' && sol.toString) {
            return sol.toString();
          }
          return String(sol);
        }).join(', ');
        
        steps.push(createStep(3, "Solutions found", solutionStr, `Found ${solutions.length} solution(s)`));
        return createSuccessResult(steps, `${variable} = ${solutionStr}`, "equation");
      } else {
        steps.push(createStep(2, "Solution", solutions.toString(), "Single solution found"));
        return createSuccessResult(steps, `${variable} = ${solutions}`, "equation");
      }
    } catch (solveError) {
      // Fallback to manual solving for simple cases
      return solveEquationManually(expr, variable, steps);
    }
  } catch (error) {
    return createErrorResult("equation", error);
  }
};

const solveLimit = (equation) => {
  try {
    const { func, variable, approach } = parseLimitInput(equation);
    const steps = [createStep(1, "Setup limit", `lim(${variable} → ${approach}) ${func}`, "Setting up the limit")];
    
    try {
      // Try direct substitution
      const substituted = func.replace(new RegExp(variable, "g"), `(${approach})`);
      const result = evaluate(substituted);
      
      if (isFinite(result)) {
        steps.push(createStep(2, "Direct substitution", `Substitute ${variable} = ${approach}`, "Direct substitution works"));
        steps.push(createStep(3, "Result", result.toString(), "Limit value"));
        return createSuccessResult(steps, result.toString(), "limit");
      }
    } catch {
      steps.push(createStep(2, "Indeterminate form", "0/0 or ∞/∞ form", "Requires L'Hôpital's rule or other techniques"));
    }
    
    return createSuccessResult(steps, "Limit requires advanced techniques", "limit");
  } catch (error) {
    return createErrorResult("limit", error);
  }
};

const simplifyExpression = (equation) => {
  try {
    const steps = [createStep(1, "Original expression", equation, "Starting expression")];
    
    let simplified;
    try {
      const parsed = parse(equation);
      simplified = simplify(parsed);
      steps.push(createStep(2, "Simplify", simplified.toString(), "Algebraic simplification"));
    } catch {
      simplified = { toString: () => equation };
    }
    
    // Try to evaluate numerically
    try {
      const evaluated = evaluate(equation);
      if (typeof evaluated === "number" && isFinite(evaluated)) {
        const rounded = Number.isInteger(evaluated) ? evaluated : parseFloat(evaluated.toFixed(10));
        steps.push(createStep(steps.length + 1, "Numerical evaluation", rounded.toString(), "Evaluated to numerical value"));
        return createSuccessResult(steps, rounded.toString(), "arithmetic");
      }
    } catch {}
    
    return createSuccessResult(steps, simplified.toString(), "simplification");
  } catch (error) {
    return createErrorResult("arithmetic", error);
  }
};

// Enhanced parsing helpers
const parseDerivativeInput = (equation) => {
  const patterns = [
    /derivative\s*\(\s*(.+?)\s*,\s*(\w+)\s*\)/i,
    /diff\s*\(\s*(.+?)\s*,\s*(\w+)\s*\)/i,
    /d\s*\/\s*d(\w+)\s*\(\s*(.+?)\s*\)/i,
    /d\s*\(\s*(.+?)\s*\)\s*\/\s*d(\w+)/i
  ];
  
  for (const pattern of patterns) {
    const match = equation.match(pattern);
    if (match) {
      if (pattern.toString().includes("d/d")) {
        return { func: match[2], variable: match[1] };
      } else if (pattern.toString().includes("d(")) {
        return { func: match[1], variable: match[2] };
      } else {
        return { func: match[1], variable: match[2] };
      }
    }
  }
  
  throw new Error("Invalid derivative syntax. Use: derivative(expression, variable)");
};

const parseIntegralInput = (equation) => {
  const patterns = [
    /integral\s*\(\s*(.+?)\s*,\s*(\w+)\s*\)/i,
    /integrate\s*\(\s*(.+?)\s*,\s*(\w+)\s*\)/i,
    /∫\s*(.+?)\s*d(\w+)/i
  ];
  
  for (const pattern of patterns) {
    const match = equation.match(pattern);
    if (match) {
      return { func: match[1].trim(), variable: match[2].trim() };
    }
  }
  
  throw new Error("Invalid integral syntax. Use: integral(expression, variable)");
};

const parseSolveInput = (equation) => {
  // Handle solve(expression, variable) format
  const solveMatch = equation.match(/solve\s*\(\s*(.+?)\s*,\s*(\w+)\s*\)/i);
  if (solveMatch) {
    return { expr: solveMatch[1].trim(), variable: solveMatch[2].trim() };
  }
  
  // Handle solve(equation = 0, variable) format
  const equationMatch = equation.match(/solve\s*\(\s*(.+?)\s*=\s*(.+?)\s*,\s*(\w+)\s*\)/i);
  if (equationMatch) {
    const leftSide = equationMatch[1].trim();
    const rightSide = equationMatch[2].trim();
    const variable = equationMatch[3].trim();
    
    // Convert to form suitable for mathjs solve: leftSide - rightSide = 0
    if (rightSide === '0') {
      return { expr: leftSide, variable };
    } else {
      return { expr: `${leftSide} - (${rightSide})`, variable };
    }
  }
  
  throw new Error("Invalid solve syntax. Use: solve(expression, variable) or solve(equation = value, variable)");
};

const parseLimitInput = (equation) => {
  // Handle limit(variable, approach, function) format
  const match = equation.match(/limit\s*\(\s*(\w+)\s*,\s*([^,]+)\s*,\s*(.+)\s*\)/i);
  if (match) {
    return { 
      variable: match[1].trim(), 
      approach: match[2].trim(), 
      func: match[3].trim() 
    };
  }
  
  // Handle lim(x->a) f(x) format
  const limMatch = equation.match(/lim\s*\(\s*(\w+)\s*(?:→|->)\s*([^)]+)\s*\)\s*(.+)/i);
  if (limMatch) {
    return { 
      variable: limMatch[1].trim(), 
      approach: limMatch[2].trim(), 
      func: limMatch[3].trim() 
    };
  }
  
  throw new Error("Invalid limit syntax. Use: limit(variable, approach, function)");
};

// Helper functions
const addDerivativeRules = (steps, func, variable) => {
  if (/\^/.test(func)) {
    steps.push(createStep(steps.length + 1, "Power rule", "d/dx[x^n] = n*x^(n-1)", "Apply power rule"));
  }
  if (/(sin|cos|tan)/.test(func)) {
    steps.push(createStep(steps.length + 1, "Trigonometric rules", "d/dx[sin(x)] = cos(x), d/dx[cos(x)] = -sin(x)", "Apply trigonometric differentiation"));
  }
  if (/(ln|log)/.test(func)) {
    steps.push(createStep(steps.length + 1, "Logarithmic rule", "d/dx[ln(x)] = 1/x", "Apply logarithmic differentiation"));
  }
  if (/exp|e\^/.test(func)) {
    steps.push(createStep(steps.length + 1, "Exponential rule", "d/dx[e^x] = e^x", "Apply exponential differentiation"));
  }
};

const solveIntegralByPattern = (func, variable, steps) => {
  // Handle power functions: x^n
  const powerMatch = func.match(new RegExp(`(\\d*)?\\*?${variable}\\^(\\d+)`));
  if (powerMatch) {
    const coeff = powerMatch[1] ? parseInt(powerMatch[1]) : 1;
    const power = parseInt(powerMatch[2]);
    const newPower = power + 1;
    const newCoeff = coeff / newPower;
    
    steps.push(createStep(steps.length + 1, "Power rule", "∫x^n dx = x^(n+1)/(n+1) + C", "Apply power rule for integration"));
    
    const result = newCoeff === 1 ? `${variable}^${newPower}` : `${newCoeff}*${variable}^${newPower}`;
    return `${result} + C`;
  }
  
  // Handle simple variable: x
  if (func === variable) {
    steps.push(createStep(steps.length + 1, "Linear function", "∫x dx = x²/2 + C", "Integrate linear function"));
    return `${variable}^2/2 + C`;
  }
  
  // Handle constants
  if (!func.includes(variable)) {
    steps.push(createStep(steps.length + 1, "Constant rule", "∫c dx = c*x + C", "Integrate constant"));
    return `${func}*${variable} + C`;
  }
  
  // Handle trigonometric functions
  if (func.includes("sin")) {
    steps.push(createStep(steps.length + 1, "Sine integration", "∫sin(x) dx = -cos(x) + C", "Integrate sine"));
    return `-cos(${variable}) + C`;
  }
  
  if (func.includes("cos")) {
    steps.push(createStep(steps.length + 1, "Cosine integration", "∫cos(x) dx = sin(x) + C", "Integrate cosine"));
    return `sin(${variable}) + C`;
  }
  
  // Default case
  steps.push(createStep(steps.length + 1, "Complex integration", "Advanced techniques required", "This integral requires more advanced methods"));
  return `∫${func} d${variable} + C (requires advanced techniques)`;
};

const solveEquationManually = (expr, variable, steps) => {
  // Try some simple patterns
  
  // Linear equation: ax + b = 0 -> x = -b/a
  const linearMatch = expr.match(new RegExp(`(-?\\d*)?\\*?${variable}\\s*([+-]\\s*\\d+)?`));
  if (linearMatch && !expr.includes('^') && !expr.includes('*' + variable + '*')) {
    try {
      const solutions = solve(expr, variable);
      if (solutions) {
        steps.push(createStep(2, "Linear equation", "Isolate the variable", "Solve linear equation"));
        return createSuccessResult(steps, `${variable} = ${solutions}`, "equation");
      }
    } catch {}
  }
  
  // Quadratic equation: ax^2 + bx + c = 0
  if (expr.includes('^2')) {
    steps.push(createStep(2, "Quadratic equation", "Use quadratic formula or factoring", "Solve quadratic equation"));
    try {
      const solutions = solve(expr, variable);
      if (Array.isArray(solutions)) {
        return createSuccessResult(steps, `${variable} = ${solutions.join(', ')}`, "equation");
      }
    } catch {}
  }
  
  steps.push(createStep(2, "Complex equation", "Advanced algebraic techniques required", "Equation requires specialized methods"));
  return createSuccessResult(steps, "Solution requires advanced techniques", "equation");
};

// Utility functions
const createStep = (step, description, expression, explanation) => ({
  step,
  description,
  expression,
  explanation
});

const createSuccessResult = (steps, finalAnswer, type) => ({
  steps,
  finalAnswer,
  type,
  success: true
});

const createErrorResult = (type, error) => ({
  steps: [],
  finalAnswer: "",
  type,
  success: false,
  error: error instanceof Error ? error.message : String(error)
});

const validateMathExpression = (expression) => {
  try {
    // Basic validation
    if (!expression || expression.trim().length === 0) {
      return { valid: false, error: "Expression cannot be empty" };
    }
    
    // Try to parse the expression
    parse(expression);
    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : "Invalid expression" 
    };
  }
};

const getExpressionType = (expression) => {
  const clean = expression.toLowerCase();
  if (isDerivativeOperation(clean)) return "derivative";
  if (isIntegralOperation(clean)) return "integral";
  if (isSolveOperation(clean)) return "equation";
  if (isLimitOperation(clean)) return "limit";
  return "simplification";
};

module.exports = {
  solveMathExpression,
  validateMathExpression,
  getExpressionType
};