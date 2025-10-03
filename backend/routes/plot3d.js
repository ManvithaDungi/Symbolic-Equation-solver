// backend/routes/plot3d.js
// NODE.JS CONCEPTS USED:
// - Express Router for modular route organization
// - RESTful API endpoints for 3D plotting operations
// - Request validation and error handling
// - Integration with mathSolver utility for 3D calculations
// - JSON response formatting with proper HTTP status codes
// - Environment variable usage for configuration

const express = require('express');
const router = express.Router();
const { evaluate3DFunction, generate3DData, validate3DExpression } = require('../utils/plot3dSolver');

// NODE.JS CONCEPT: POST endpoint for 3D function evaluation
// Evaluates a 3D mathematical function at given coordinates
router.post('/evaluate', async (req, res) => {
  try {
    const { equation, x, y, parameters = {} } = req.body;

    // NODE.JS CONCEPT: Input validation
    if (!equation || typeof x !== 'number' || typeof y !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Invalid input: equation, x, and y coordinates are required',
        details: {
          equation: equation ? 'provided' : 'missing',
          x: typeof x === 'number' ? 'valid' : 'invalid',
          y: typeof y === 'number' ? 'valid' : 'invalid'
        }
      });
    }

    // NODE.JS CONCEPT: Function evaluation with error handling
    const result = await evaluate3DFunction(equation, x, y, parameters);
    
    res.json({
      success: true,
      data: {
        x,
        y,
        z: result.z,
        equation: equation,
        parameters: parameters
      },
      metadata: {
        timestamp: new Date().toISOString(),
        computationTime: result.computationTime
      }
    });

  } catch (error) {
    // NODE.JS CONCEPT: Error handling with detailed error messages
    console.error('3D Function evaluation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to evaluate 3D function',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// NODE.JS CONCEPT: POST endpoint for generating 3D surface data
// Generates a grid of points for 3D surface visualization
router.post('/surface', async (req, res) => {
  try {
    const { 
      equation, 
      domain = { x: [-5, 5], y: [-5, 5] }, 
      resolution = 50,
      parameters = {} 
    } = req.body;

    // NODE.JS CONCEPT: Input validation with default values
    if (!equation) {
      return res.status(400).json({
        success: false,
        error: 'Equation is required for 3D surface generation'
      });
    }

    // NODE.JS CONCEPT: Data generation with performance monitoring
    const startTime = Date.now();
    const surfaceData = await generate3DData(equation, domain, resolution, parameters);
    const computationTime = Date.now() - startTime;

    res.json({
      success: true,
      data: {
        vertices: surfaceData.vertices,
        indices: surfaceData.indices,
        bounds: surfaceData.bounds,
        statistics: surfaceData.statistics
      },
      metadata: {
        equation,
        domain,
        resolution,
        parameters,
        computationTime,
        pointCount: surfaceData.vertices.length / 3,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('3D Surface generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate 3D surface data',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// NODE.JS CONCEPT: POST endpoint for 3D expression validation
// Validates 3D mathematical expressions before computation
router.post('/validate', async (req, res) => {
  try {
    const { equation, parameters = {} } = req.body;

    if (!equation) {
      return res.status(400).json({
        success: false,
        error: 'Equation is required for validation'
      });
    }

    // NODE.JS CONCEPT: Expression validation
    const validation = await validate3DExpression(equation, parameters);

    res.json({
      success: true,
      data: {
        isValid: validation.isValid,
        variables: validation.variables,
        functions: validation.functions,
        warnings: validation.warnings,
        suggestions: validation.suggestions
      },
      metadata: {
        equation,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('3D Expression validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate 3D expression',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// NODE.JS CONCEPT: GET endpoint for 3D function presets
// Returns predefined 3D functions for quick access
router.get('/presets', (req, res) => {
  try {
    const presets = [
      {
        id: 'paraboloid',
        name: 'Paraboloid',
        equation: 'x^2 + y^2',
        description: 'Classic 3D paraboloid surface',
        domain: { x: [-3, 3], y: [-3, 3] },
        parameters: {},
        category: 'quadratic'
      },
      {
        id: 'hyperbolic-paraboloid',
        name: 'Hyperbolic Paraboloid',
        equation: 'x^2 - y^2',
        description: 'Saddle-shaped surface',
        domain: { x: [-3, 3], y: [-3, 3] },
        parameters: {},
        category: 'quadratic'
      },
      {
        id: 'sphere',
        name: 'Sphere',
        equation: 'sqrt(4 - x^2 - y^2)',
        description: 'Upper hemisphere',
        domain: { x: [-1.8, 1.8], y: [-1.8, 1.8] },
        parameters: {},
        category: 'geometric'
      },
      {
        id: 'sine-wave',
        name: 'Sine Wave Surface',
        equation: 'sin(sqrt(x^2 + y^2))',
        description: 'Radial sine wave pattern',
        domain: { x: [-6, 6], y: [-6, 6] },
        parameters: {},
        category: 'trigonometric'
      },
      {
        id: 'exponential',
        name: 'Exponential Surface',
        equation: 'exp(-(x^2 + y^2)/4)',
        description: 'Gaussian-like exponential surface',
        domain: { x: [-4, 4], y: [-4, 4] },
        parameters: {},
        category: 'exponential'
      },
      {
        id: 'ripple',
        name: 'Ripple Surface',
        equation: 'sin(x) * cos(y)',
        description: 'Intersecting sine and cosine waves',
        domain: { x: [-4, 4], y: [-4, 4] },
        parameters: {},
        category: 'trigonometric'
      },
      {
        id: 'parametric',
        name: 'Parametric Surface',
        equation: '1*x^2 + 1*y^2 + 0*x*y',
        description: 'Customizable quadratic surface',
        domain: { x: [-3, 3], y: [-3, 3] },
        parameters: { a: 1, b: 1, c: 0 },
        category: 'parametric'
      },
      {
        id: 'mountain',
        name: 'Mountain Range',
        equation: 'sin(x/2) * cos(y/2) + 0.5*sin(x) * sin(y)',
        description: 'Complex mountainous terrain',
        domain: { x: [-6, 6], y: [-6, 6] },
        parameters: {},
        category: 'complex'
      }
    ];

    res.json({
      success: true,
      data: presets,
      metadata: {
        count: presets.length,
        categories: [...new Set(presets.map(p => p.category))],
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('3D Presets error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve 3D presets',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// NODE.JS CONCEPT: GET endpoint for 3D plotting statistics
// Returns usage statistics and performance metrics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalRequests: 0, // This would be tracked in a real application
      averageComputationTime: 0,
      mostPopularFunctions: [],
      errorRate: 0,
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: stats,
      metadata: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('3D Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve 3D statistics',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
