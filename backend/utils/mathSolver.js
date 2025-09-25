// backend/utils/mathSolver.js
const { evaluate, parse, derivative, simplify } = require("mathjs");

const solveMathExpression = (equation) => {
  try {
    const cleanEquation = equation.trim().toLowerCase();

    if (isDerivativeOperation(cleanEquation)) return solveDerivative(equation);
    if (isIntegralOperation(cleanEquation)) return solveIntegral(equation);
    if (isEquationSolving(cleanEquation)) return solveEquation(equation);
    if (isLimitOperation(cleanEquation)) return solveLimit(equation);
    return simplifyExpression(equation);
  } catch (error) {
    return createErrorResult("general", error);
  }
};

const isDerivativeOperation = (eq) => /\b(derivative|diff|d\/d|differentiate)\b/i.test(eq);
const isIntegralOperation = (eq) => /\b(integral|integrate|∫)\b/i.test(eq);
const isEquationSolving = (eq) => /\b(solve|find|roots?)\b/i.test(eq) && eq.includes("=");
const isLimitOperation = (eq) => /\b(limit|lim)\b/i.test(eq);

const solveDerivative = (equation) => {
  try {
    const { func, variable } = parseDerivativeInput(equation);
    const steps = [];
    steps.push(createStep(1, "Original function", `f(${variable}) = ${func}`, "Starting function"));
    const parsed = parse(func);
    const derivativeResult = derivative(parsed, variable);
    const simplified = simplify(derivativeResult);
    addDerivativeRules(steps, func, variable);
    steps.push(createStep(steps.length + 1, "Final derivative", `f'(${variable}) = ${simplified.toString()}`, "Applying differentiation rules"));
    return createSuccessResult(steps, simplified.toString(), "calculus");
  } catch (error) {
    return createErrorResult("calculus", error);
  }
};

const solveIntegral = (equation) => {
  try {
    const { func, variable } = parseIntegralInput(equation);
    const steps = [createStep(1, "Setup integral", `∫ ${func} d${variable}`, "Setting up integral")];
    const result = solveIntegralByPattern(func, variable, steps);
    return createSuccessResult(steps, result, "calculus");
  } catch (error) {
    return createErrorResult("calculus", error);
  }
};

const solveEquation = (equation) => {
  try {
    const { expr, variable } = parseEquationInput(equation);
    const steps = [createStep(1, "Original equation", expr, "Starting equation")];
    return solveEquationManually(expr, variable, steps);
  } catch (error) {
    return createErrorResult("algebra", error);
  }
};

const solveLimit = (equation) => {
  try {
    const { func, variable, approach } = parseLimitInput(equation);
    const steps = [createStep(1, "Setup limit", `lim(${variable} → ${approach}) ${func}`, "Setting up limit")];
    try {
      const substituted = func.replace(new RegExp(variable, "g"), approach);
      const result = evaluate(substituted);
      if (isFinite(result)) {
        steps.push(createStep(2, "Direct substitution", `${result}`, "Limit exists"));
        return createSuccessResult(steps, result.toString(), "calculus");
      }
    } catch {
      steps.push(createStep(2, "Indeterminate form", "0/0 or ∞/∞", "Requires advanced techniques"));
    }
    return createSuccessResult(steps, "Limit requires advanced techniques", "calculus");
  } catch (error) {
    return createErrorResult("calculus", error);
  }
};

const simplifyExpression = (equation) => {
  try {
    const steps = [createStep(1, "Original expression", equation, "Starting expression")];
    const parsed = parse(equation);
    let simplified, evaluated;
    try { simplified = simplify(parsed); } catch { simplified = parsed; }
    try {
      evaluated = evaluate(equation);
      if (typeof evaluated === "number" && isFinite(evaluated)) {
        const rounded = Number.isInteger(evaluated) ? evaluated : parseFloat(evaluated.toFixed(10));
        steps.push(createStep(steps.length + 1, "Numerical evaluation", rounded.toString(), "Evaluated numerically"));
        return createSuccessResult(steps, rounded.toString(), "arithmetic");
      }
    } catch {}
    return createSuccessResult(steps, simplified.toString(), "arithmetic");
  } catch (error) {
    return createErrorResult("arithmetic", error);
  }
};

// Parsing helpers
const parseDerivativeInput = (equation) => {
  const patterns = [/derivative\((.+?),\s*(\w+)\)/i, /diff\((.+?),\s*(\w+)\)/i, /d\/d(\w+)\((.+?)\)/i, /d\((.+?)\)\/d(\w+)/i];
  for (const pattern of patterns) {
    const match = equation.match(pattern);
    if (match) return pattern.toString().includes("d/d") || pattern.toString().includes("d(")
      ? { func: match[2] || match[1], variable: match[1] || match[2] }
      : { func: match[1], variable: match[2] };
  }
  throw new Error("Invalid derivative syntax");
};

const parseIntegralInput = (equation) => {
  const patterns = [/integral\((.+?),\s*(\w+)\)/i, /integrate\((.+?),\s*(\w+)\)/i, /∫\s*(.+?)\s*d(\w+)/i];
  for (const pattern of patterns) {
    const match = equation.match(pattern);
    if (match) return { func: match[1], variable: match[2] };
  }
  throw new Error("Invalid integral syntax");
};

const parseEquationInput = (equation) => {
  const cleanEq = equation.replace(/solve\((.+?),\s*(\w+)\)/i, "$1");
  const variableMatch = equation.match(/solve\(.+?,\s*(\w+)\)/i) || equation.match(/find\s+(\w+)/i);
  return { expr: cleanEq, variable: variableMatch ? variableMatch[1] : "x" };
};

const parseLimitInput = (equation) => {
  const match = equation.match(/lim(?:it)?\s*\(?\s*(\w+)\s*(?:→|->|approaches?)\s*([^,)]+)[,)]?\s*(.+)/i);
  if (match) return { variable: match[1], approach: match[2].trim(), func: match[3].trim() };
  throw new Error("Invalid limit syntax");
};

// Helpers
const addDerivativeRules = (steps, func, variable) => {
  if (func.includes("^")) steps.push(createStep(steps.length+1, "Power rule", "d/dx[x^n]=n*x^(n-1)","Power rule applied"));
  if (func.includes("sin")||func.includes("cos")||func.includes("tan")) steps.push(createStep(steps.length+1,"Trig rules","d/dx[sin(x)]=cos(x), d/dx[cos(x)]=-sin(x)","Trig differentiation"));
  if (func.includes("ln")||func.includes("log")) steps.push(createStep(steps.length+1,"Log rule","d/dx[ln(x)]=1/x","Log differentiation"));
  if (func.includes("e^")) steps.push(createStep(steps.length+1,"Exp rule","d/dx[e^x]=e^x","Exp differentiation"));
};

const solveIntegralByPattern = (func, variable, steps) => {
  const powerMatch = func.match(new RegExp(`(\\d*)?\\*?${variable}\\^(\\d+)`));
  if(powerMatch){const coeff = powerMatch[1]?parseInt(powerMatch[1]):1;const power=parseInt(powerMatch[2]);const newPower=power+1;const newCoeff=coeff/newPower;steps.push(createStep(steps.length+1,"Power rule",`∫x^n dx = x^(n+1)/(n+1) + C`,"Power rule"));return `${newCoeff===1?"":newCoeff}${variable}^${newPower} + C`;}
  if(func===variable){steps.push(createStep(steps.length+1,"Linear function","∫x dx = x²/2 + C","Linear integration"));return `${variable}²/2 + C`;}
  if(!func.includes(variable)){steps.push(createStep(steps.length+1,"Constant","∫c dx = cx + C","Constant integration"));return `${func}*${variable} + C`;}
  if(func.includes("sin")){steps.push(createStep(steps.length+1,"Sine","∫sin(x) dx = -cos(x) + C","Trig"));return `-cos(${variable}) + C`;}
  if(func.includes("cos")){steps.push(createStep(steps.length+1,"Cosine","∫cos(x) dx = sin(x) + C","Trig"));return `sin(${variable}) + C`;}
  return `∫${func} d${variable} (advanced techniques)`;
};

const solveEquationManually = (expr, variable, steps) => {
  steps.push(createStep(steps.length+1,"Manual solution","Algebraic manipulation","Step-by-step algebra"));
  return createSuccessResult(steps,"Solution requires advanced techniques","algebra");
};

// Utilities
const createStep=(step,desc,expr,explanation)=>({step,description:desc,expression:expr,explanation});
const createSuccessResult=(steps,finalAnswer,type)=>({steps,finalAnswer,type,success:true});
const createErrorResult=(type,error)=>({steps:[],finalAnswer:"",type,success:false,error:error instanceof Error?error.message:String(error)});

const validateMathExpression=(expression)=>{try{parse(expression);return {valid:true}}catch(error){return {valid:false,error:error instanceof Error?error.message:"Invalid expression"}}};
const getExpressionType=(expression)=>{const clean=expression.toLowerCase();if(isDerivativeOperation(clean))return "derivative";if(isIntegralOperation(clean))return "integral";if(isEquationSolving(clean))return "equation";if(isLimitOperation(clean))return "limit";return "simplification";};

module.exports={solveMathExpression,validateMathExpression,getExpressionType};
