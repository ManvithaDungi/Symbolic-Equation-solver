// frontend/src/components/Plot3D.js
// REACT CONCEPTS USED:
// - Functional Component with Hooks (useState, useMemo, useRef)
// - Performance Optimization (useMemo for expensive 3D calculations)
// - Event Handling (mouse interactions, parameter changes)
// - Component Composition (Three.js integration with React)
// - Conditional Rendering (different plot types)
// - Custom Hooks Pattern (3D plotting logic)

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import { evaluate } from 'mathjs';
import { Sliders } from 'lucide-react';
import './Plot3D.css';

// REACT CONCEPT: Custom Hook for 3D function evaluation
const useFunction3D = (equation, domain, resolution = 50) => {
  return useMemo(() => {
    try {
      const [xMin, xMax] = domain.x;
      const [yMin, yMax] = domain.y;
      const vertices = [];
      const indices = [];
      
      for (let i = 0; i <= resolution; i++) {
        for (let j = 0; j <= resolution; j++) {
          const x = xMin + (xMax - xMin) * (i / resolution);
          const y = yMin + (yMax - yMin) * (j / resolution);
          
          try {
            // Improved variable replacement to handle complex expressions
            let expr = equation;
            
            // Replace variables more carefully to avoid breaking expressions
            expr = expr.replace(/\bx\b/g, `(${x})`);
            expr = expr.replace(/\by\b/g, `(${y})`);
            
            // Handle common mathematical functions and constants
            expr = expr.replace(/\bpi\b/g, '3.14159265359');
            expr = expr.replace(/\be\b/g, '2.71828182846');
            
            const z = evaluate(expr);
            
            if (typeof z === 'number' && isFinite(z)) {
              vertices.push(x, y, z);
            } else {
              // Use a small offset instead of 0 to avoid flat surfaces
              vertices.push(x, y, 0.001);
            }
          } catch (error) {
            console.warn(`Failed to evaluate at (${x}, ${y}):`, error.message);
            vertices.push(x, y, 0.001);
          }
        }
      }
      
      // Create triangle indices
      for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
          const a = i * (resolution + 1) + j;
          const b = a + 1;
          const c = a + resolution + 1;
          const d = c + 1;
          
          indices.push(a, b, c);
          indices.push(b, d, c);
        }
      }
      
      return { vertices, indices };
    } catch (error) {
      console.error('3D function evaluation failed:', error);
      return { vertices: [], indices: [] };
    }
  }, [equation, domain, resolution]);
};

// REACT CONCEPT: 3D Surface Component with Three.js
const Surface3D = ({ equation, domain, color = '#3b82f6', opacity = 0.8 }) => {
  const meshRef = useRef();
  const { vertices, indices } = useFunction3D(equation, domain);
  
  // REACT CONCEPT: Animation with useFrame hook
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });
  
  if (vertices.length === 0) return null;
  
  return (
    <mesh ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={vertices.length / 3}
          array={new Float32Array(vertices)}
          itemSize={3}
        />
        <bufferAttribute
          attach="index"
          array={new Uint16Array(indices)}
          count={indices.length}
        />
      </bufferGeometry>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        wireframe={false}
        side={2} // DoubleSide
      />
    </mesh>
  );
};

// REACT CONCEPT: Interactive Parameter Slider Component
const ParameterSlider = ({ label, value, min, max, step, onChange, color = '#3b82f6' }) => (
  <div className="parameter-slider">
    <label className="slider-label">
      {label}: <span style={{ color }}>{value}</span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="slider-input"
      style={{ '--slider-color': color }}
    />
  </div>
);

// REACT CONCEPT: Main 3D Plot Component
const Plot3D = ({ equation, domain, parameters = {}, onParameterChange }) => {
  const [showGrid, setShowGrid] = useState(true);
  const [error, setError] = useState(null);
  
  // REACT CONCEPT: State Management for 3D plot controls
  const [plotSettings, setPlotSettings] = useState({
    resolution: 30,
    opacity: 0.8,
    wireframe: false,
    color: '#3b82f6'
  });
  
  // REACT CONCEPT: Event Handling for parameter updates
  const handleParameterChange = (paramName, value) => {
    if (onParameterChange) {
      onParameterChange({ ...parameters, [paramName]: value });
    }
  };
  
  // Validate equation and domain
  useEffect(() => {
    try {
      if (!equation || !domain) {
        setError('Missing equation or domain');
        return;
      }
      
      // Test equation with sample values
      const testExpr = equation.replace(/\bx\b/g, '(0)').replace(/\by\b/g, '(0)');
      evaluate(testExpr);
      setError(null);
    } catch (err) {
      setError(`Invalid equation: ${err.message}`);
    }
  }, [equation, domain]);
  
  return (
    <div className="plot3d-container">
      {/* REACT CONCEPT: Conditional Rendering - Error Display */}
      {error && (
        <div className="plot3d-error" style={{ 
          padding: '1rem', 
          backgroundColor: '#fee2e2', 
          color: '#dc2626', 
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          border: '1px solid #fecaca'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {/* REACT CONCEPT: Conditional Rendering - Control Panel */}
      <div className="plot3d-controls">
        <div className="control-section">
          <h4><Sliders size={16} /> Parameters</h4>
          {Object.entries(parameters).map(([key, value]) => (
            <ParameterSlider
              key={key}
              label={key}
              value={value}
              min={-10}
              max={10}
              step={0.1}
              onChange={(val) => handleParameterChange(key, val)}
              color={plotSettings.color}
            />
          ))}
        </div>
        
        <div className="control-section">
          <h4>Display Options</h4>
          <div className="display-controls">
            <label>
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
              />
              Show Grid
            </label>
            <label>
              <input
                type="checkbox"
                checked={plotSettings.wireframe}
                onChange={(e) => setPlotSettings(prev => ({ ...prev, wireframe: e.target.checked }))}
              />
              Wireframe
            </label>
          </div>
          
          <ParameterSlider
            label="Opacity"
            value={plotSettings.opacity}
            min={0.1}
            max={1}
            step={0.1}
            onChange={(val) => setPlotSettings(prev => ({ ...prev, opacity: val }))}
          />
          
          <ParameterSlider
            label="Resolution"
            value={plotSettings.resolution}
            min={10}
            max={100}
            step={5}
            onChange={(val) => setPlotSettings(prev => ({ ...prev, resolution: val }))}
          />
        </div>
      </div>
      
      {/* REACT CONCEPT: Component Composition - 3D Canvas */}
      <div className="plot3d-canvas">
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          {showGrid && <Grid args={[20, 20]} />}
          
          <Surface3D
            equation={equation}
            domain={domain}
            color={plotSettings.color}
            opacity={plotSettings.opacity}
          />
          
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          
          {/* REACT CONCEPT: Conditional Rendering - Axis Labels */}
          <Text position={[domain.x[1] + 1, 0, 0]} fontSize={0.5} color="white">X</Text>
          <Text position={[0, domain.y[1] + 1, 0]} fontSize={0.5} color="white">Y</Text>
          <Text position={[0, 0, 5]} fontSize={0.5} color="white">Z</Text>
        </Canvas>
      </div>
    </div>
  );
};

export default Plot3D;
