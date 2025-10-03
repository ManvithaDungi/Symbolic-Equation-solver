// frontend/src/components/InteractiveManipulator.js
// REACT CONCEPTS USED:
// - Functional Component with Hooks (useState, useCallback, useMemo)
// - Event Handling (slider changes, button clicks)
// - State Management (parameter values, animation states)
// - Performance Optimization (useCallback for event handlers)
// - Component Composition (reusable slider components)
// - Conditional Rendering (different manipulation modes)

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, Play, Pause, RotateCcw, Zap, Eye, EyeOff } from 'lucide-react';
import './InteractiveManipulator.css';

// REACT CONCEPT: Reusable Parameter Slider Component
const ParameterSlider = ({ 
  name, 
  value, 
  min, 
  max, 
  step, 
  onChange, 
  color = '#3b82f6',
  label,
  unit = '',
  isAnimating = false 
}) => {
  const handleChange = useCallback((e) => {
    onChange(name, parseFloat(e.target.value));
  }, [name, onChange]);

  return (
    <motion.div 
      className="parameter-slider-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="slider-header">
        <label className="slider-label">
          {label || name}: <span className="slider-value" style={{ color }}>{value}{unit}</span>
        </label>
        {isAnimating && (
          <motion.div 
            className="animation-indicator"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Zap size={12} />
          </motion.div>
        )}
      </div>
      
      <div className="slider-track">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="slider-input"
          style={{ '--slider-color': color }}
        />
        <div className="slider-range-labels">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </motion.div>
  );
};

// REACT CONCEPT: Animation Sequence Component
const AnimationSequence = ({ parameters, onParameterChange, isPlaying, onToggle }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  
  const animationSteps = useMemo(() => {
    const steps = [];
    const paramNames = Object.keys(parameters);
    
    // Create animation steps that cycle through parameter ranges
    for (let i = 0; i < 100; i++) {
      const step = {};
      paramNames.forEach(param => {
        const { min, max } = parameters[param];
        const progress = (i / 99) * Math.PI * 2; // Full sine wave cycle
        step[param] = min + (max - min) * (Math.sin(progress) + 1) / 2;
      });
      steps.push(step);
    }
    return steps;
  }, [parameters]);
  
  React.useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = (prev + 1) % animationSteps.length;
        const stepParams = animationSteps[nextStep];
        
        // Update all parameters
        Object.entries(stepParams).forEach(([name, value]) => {
          onParameterChange(name, value);
        });
        
        return nextStep;
      });
    }, 100 / animationSpeed);
    
    return () => clearInterval(interval);
  }, [isPlaying, animationSteps, onParameterChange, animationSpeed]);
  
  return (
    <div className="animation-sequence">
      <div className="animation-controls">
        <button 
          className={`animation-btn ${isPlaying ? 'playing' : ''}`}
          onClick={onToggle}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? 'Pause' : 'Play'} Animation
        </button>
        
        <div className="speed-control">
          <label>Speed:</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
            className="speed-slider"
          />
          <span>{animationSpeed}x</span>
        </div>
      </div>
      
      <div className="animation-progress">
        <div className="progress-bar">
          <motion.div 
            className="progress-fill"
            style={{ width: `${(currentStep / animationSteps.length) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <span className="progress-text">
          Step {currentStep + 1} of {animationSteps.length}
        </span>
      </div>
    </div>
  );
};

// REACT CONCEPT: Main Interactive Manipulator Component
const InteractiveManipulator = ({ 
  equation, 
  parameters = {}, 
  onParameterChange, 
  onEquationChange,
  presetFunctions = [] 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [manipulationMode, setManipulationMode] = useState('parameters'); // 'parameters', 'equation', 'presets'
  
  // REACT CONCEPT: Event Handling with useCallback for performance
  const handleParameterChange = useCallback((name, value) => {
    if (onParameterChange) {
      onParameterChange({ ...parameters, [name]: value });
    }
  }, [parameters, onParameterChange]);
  
  const handleReset = useCallback(() => {
    const resetParams = {};
    Object.keys(parameters).forEach(key => {
      resetParams[key] = parameters[key].default || 0;
    });
    onParameterChange(resetParams);
  }, [parameters, onParameterChange]);
  
  const handlePresetSelect = useCallback((preset) => {
    if (onEquationChange) {
      onEquationChange(preset.equation);
    }
    if (preset.parameters) {
      onParameterChange(preset.parameters);
    }
    setShowPresets(false);
  }, [onEquationChange, onParameterChange]);
  
  // REACT CONCEPT: Conditional Rendering based on manipulation mode
  const renderManipulationPanel = () => {
    switch (manipulationMode) {
      case 'parameters':
        return (
          <div className="parameters-panel">
            <div className="panel-header">
              <h3><Sliders size={18} /> Interactive Parameters</h3>
              <button className="reset-btn" onClick={handleReset}>
                <RotateCcw size={14} /> Reset
              </button>
            </div>
            
            <div className="parameters-grid">
              {Object.entries(parameters).map(([name, config]) => (
                <ParameterSlider
                  key={name}
                  name={name}
                  value={config.value || config.default || 0}
                  min={config.min || -10}
                  max={config.max || 10}
                  step={config.step || 0.1}
                  onChange={handleParameterChange}
                  color={config.color || '#3b82f6'}
                  label={config.label || name}
                  unit={config.unit || ''}
                  isAnimating={isAnimating}
                />
              ))}
            </div>
            
            <AnimationSequence
              parameters={parameters}
              onParameterChange={handleParameterChange}
              isPlaying={isAnimating}
              onToggle={() => setIsAnimating(!isAnimating)}
            />
          </div>
        );
        
      case 'presets':
        return (
          <div className="presets-panel">
            <div className="panel-header">
              <h3>Function Presets</h3>
              <button 
                className="toggle-btn"
                onClick={() => setShowPresets(!showPresets)}
              >
                {showPresets ? <EyeOff size={16} /> : <Eye size={16} />}
                {showPresets ? 'Hide' : 'Show'} Presets
              </button>
            </div>
            
            <AnimatePresence>
              {showPresets && (
                <motion.div 
                  className="presets-grid"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {presetFunctions.map((preset, index) => (
                    <motion.button
                      key={index}
                      className="preset-btn"
                      onClick={() => handlePresetSelect(preset)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="preset-name">{preset.name}</div>
                      <div className="preset-equation">{preset.equation}</div>
                      {preset.description && (
                        <div className="preset-description">{preset.description}</div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="interactive-manipulator">
      <div className="manipulator-header">
        <h2>Interactive Function Manipulator</h2>
        <p>Drag sliders to see how parameters affect your function in real-time</p>
      </div>
      
      <div className="manipulation-modes">
        <button 
          className={`mode-btn ${manipulationMode === 'parameters' ? 'active' : ''}`}
          onClick={() => setManipulationMode('parameters')}
        >
          <Sliders size={16} /> Parameters
        </button>
        <button 
          className={`mode-btn ${manipulationMode === 'presets' ? 'active' : ''}`}
          onClick={() => setManipulationMode('presets')}
        >
          <Zap size={16} /> Presets
        </button>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={manipulationMode}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          {renderManipulationPanel()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default InteractiveManipulator;
