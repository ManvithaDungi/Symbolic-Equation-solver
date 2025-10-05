// backend/utils/plot3dSolver.js
// NODE.JS CONCEPTS USED:
// - Module exports for utility functions
// - Math.js integration for 3D mathematical computations
// - Error handling with try-catch blocks
// - Performance monitoring with timing
// - Data validation and sanitization
// - Complex mathematical operations and 3D geometry

const { evaluate, parse, simplify, derivative } = require('mathjs');

// NODE.JS CONCEPT: Error handling for missing dependencies
if (!evaluate || !parse) {
  throw new Error('Math.js library is not properly installed or imported');
}

// NODE.JS CONCEPT: 3D Function Evaluation
// Evaluates a 3D mathematical function at specific coordinates
const evaluate3DFunction = async (equation, x, y, parameters = {}) => {
  const startTime = Date.now();
  
  try {
    // NODE.JS CONCEPT: Input sanitization and validation
    if (typeof x !== 'number' || typeof y !== 'number' || !isFinite(x) || !isFinite(y)) {
      throw new Error('Invalid coordinates: x and y must be finite numbers');
    }

    // NODE.JS CONCEPT: Parameter substitution in equation
    let processedEquation = equation;
    
    // Replace parameters in the equation
    Object.keys(parameters).forEach(param => {
      const value = parameters[param];
      if (typeof value === 'number' && isFinite(value)) {
        processedEquation = processedEquation.replace(new RegExp(`\\b${param}\\b`, 'g'), value.toString());
      }
    });

    // NODE.JS CONCEPT: Variable substitution for x and y
    const expression = processedEquation
      .replace(/\bx\b/g, `(${x})`)
      .replace(/\by\b/g, `(${y})`);

    // NODE.JS CONCEPT: Mathematical evaluation with error handling
    const z = evaluate(expression);
    
    if (typeof z !== 'number' || !isFinite(z)) {
      throw new Error('Function evaluation resulted in invalid number');
    }

    const computationTime = Date.now() - startTime;
    
    return {
      z,
      computationTime,
      expression: processedEquation
    };

  } catch (error) {
    const computationTime = Date.now() - startTime;
    throw new Error(`3D function evaluation failed: ${error.message}`);
  }
};

// NODE.JS CONCEPT: 3D Surface Data Generation
// Generates vertices and indices for 3D surface rendering
const generate3DData = async (equation, domain, resolution, parameters = {}) => {
  const startTime = Date.now();
  
  try {
    // NODE.JS CONCEPT: Input validation and defaults
    const xMin = domain.x[0] || -5;
    const xMax = domain.x[1] || 5;
    const yMin = domain.y[0] || -5;
    const yMax = domain.y[1] || 5;
    const res = Math.max(10, Math.min(100, resolution || 50));

    const vertices = [];
    const indices = [];
    const validPoints = [];
    let minZ = Infinity;
    let maxZ = -Infinity;
    let validCount = 0;

    // NODE.JS CONCEPT: Grid generation with error handling
    for (let i = 0; i <= res; i++) {
      for (let j = 0; j <= res; j++) {
        const x = xMin + (xMax - xMin) * (i / res);
        const y = yMin + (yMax - yMin) * (j / res);
        
        try {
          const result = await evaluate3DFunction(equation, x, y, parameters);
          const z = result.z;
          
          if (isFinite(z)) {
            vertices.push(x, y, z);
            validPoints.push({ x, y, z, i, j });
            minZ = Math.min(minZ, z);
            maxZ = Math.max(maxZ, z);
            validCount++;
          } else {
            vertices.push(x, y, 0);
          }
        } catch (error) {
          // NODE.JS CONCEPT: Error handling for invalid points
          vertices.push(x, y, 0);
        }
      }
    }

    // NODE.JS CONCEPT: Triangle mesh generation
    for (let i = 0; i < res; i++) {
      for (let j = 0; j < res; j++) {
        const a = i * (res + 1) + j;
        const b = a + 1;
        const c = a + res + 1;
        const d = c + 1;

        // Create two triangles for each quad
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    const computationTime = Date.now() - startTime;

    return {
      vertices,
      indices,
      bounds: {
        x: [xMin, xMax],
        y: [yMin, yMax],
        z: [minZ, maxZ]
      },
      statistics: {
        totalPoints: (res + 1) * (res + 1),
        validPoints: validCount,
        invalidPoints: (res + 1) * (res + 1) - validCount,
        computationTime,
        resolution: res
      }
    };

  } catch (error) {
    throw new Error(`3D data generation failed: ${error.message}`);
  }
};

// NODE.JS CONCEPT: 3D Expression Validation
// Validates 3D mathematical expressions for syntax and safety
const validate3DExpression = async (equation, parameters = {}) => {
  try {
    // NODE.JS CONCEPT: Basic syntax validation
    if (!equation || typeof equation !== 'string') {
      return {
        isValid: false,
        error: 'Equation must be a non-empty string',
        variables: [],
        functions: [],
        warnings: [],
        suggestions: []
      };
    }

    // NODE.JS CONCEPT: Parse and analyze the expression
    const parsed = parse(equation);
    const variables = [];
    const functions = [];
    const warnings = [];
    const suggestions = [];

    // NODE.JS CONCEPT: Extract variables and functions
    const extractNodes = (node) => {
      if (node.type === 'SymbolNode') {
        if (!['x', 'y', 'e', 'pi'].includes(node.name) && !parameters[node.name]) {
          variables.push(node.name);
        }
      } else if (node.type === 'FunctionNode') {
        functions.push(node.name);
      }
      
      if (node.args) {
        node.args.forEach(extractNodes);
      }
    };

    extractNodes(parsed);

    // NODE.JS CONCEPT: Validation checks
    const hasX = equation.includes('x');
    const hasY = equation.includes('y');
    
    if (!hasX && !hasY) {
      warnings.push('Expression does not contain x or y variables');
      suggestions.push('Add x and/or y variables to create a 3D surface');
    }

    // NODE.JS CONCEPT: Check for undefined variables
    const undefinedVars = variables.filter(v => !parameters[v]);
    if (undefinedVars.length > 0) {
      warnings.push(`Undefined variables: ${undefinedVars.join(', ')}`);
      suggestions.push('Define values for undefined variables in parameters');
    }

    // NODE.JS CONCEPT: Check for potentially problematic functions
    const dangerousFunctions = ['eval', 'import', 'require'];
    const foundDangerous = functions.filter(f => dangerousFunctions.includes(f));
    if (foundDangerous.length > 0) {
      return {
        isValid: false,
        error: `Dangerous functions detected: ${foundDangerous.join(', ')}`,
        variables,
        functions,
        warnings,
        suggestions: ['Remove dangerous functions for security']
      };
    }

    // NODE.JS CONCEPT: Test evaluation with sample values
    try {
      const testResult = await evaluate3DFunction(equation, 0, 0, parameters);
      if (!isFinite(testResult.z)) {
        warnings.push('Function may produce invalid results at some points');
        suggestions.push('Check for division by zero or undefined operations');
      }
    } catch (error) {
      warnings.push('Function evaluation test failed');
      suggestions.push('Check equation syntax and variable definitions');
    }

    return {
      isValid: warnings.length === 0,
      variables: [...new Set(variables)],
      functions: [...new Set(functions)],
      warnings,
      suggestions
    };

  } catch (error) {
    return {
      isValid: false,
      error: `Expression validation failed: ${error.message}`,
      variables: [],
      functions: [],
      warnings: ['Invalid mathematical expression'],
      suggestions: ['Check equation syntax and mathematical notation']
    };
  }
};

// NODE.JS CONCEPT: 3D Function Analysis
// Analyzes 3D functions for mathematical properties
const analyze3DFunction = async (equation, domain, parameters = {}) => {
  try {
    const analysis = {
      type: 'unknown',
      symmetry: 'none',
      extrema: [],
      asymptotes: [],
      domain: domain,
      range: { z: [null, null] }
    };

    // NODE.JS CONCEPT: Function type detection
    if (equation.includes('sin') || equation.includes('cos') || equation.includes('tan')) {
      analysis.type = 'trigonometric';
    } else if (equation.includes('exp') || equation.includes('log')) {
      analysis.type = 'exponential';
    } else if (equation.includes('sqrt') || equation.includes('^')) {
      analysis.type = 'algebraic';
    } else if (equation.includes('x^2') && equation.includes('y^2')) {
      analysis.type = 'quadratic';
    }

    // NODE.JS CONCEPT: Symmetry analysis
    const hasX = equation.includes('x');
    const hasY = equation.includes('y');
    
    if (hasX && hasY) {
      const xNegated = equation.replace(/\bx\b/g, '(-x)');
      const yNegated = equation.replace(/\by\b/g, '(-y)');
      
      if (xNegated === equation) {
        analysis.symmetry = 'x-axis';
      } else if (yNegated === equation) {
        analysis.symmetry = 'y-axis';
      }
    }

    return analysis;

  } catch (error) {
    throw new Error(`3D function analysis failed: ${error.message}`);
  }
};

// NODE.JS CONCEPT: Module exports
module.exports = {
  evaluate3DFunction,
  generate3DData,
  validate3DExpression,
  analyze3DFunction
};
