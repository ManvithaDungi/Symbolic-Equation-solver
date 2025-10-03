// frontend/src/components/AnimationSequences.js
// REACT CONCEPTS USED:
// - Functional Component with Hooks (useState, useEffect, useRef, useCallback)
// - Animation Libraries (Framer Motion for complex animations)
// - Performance Optimization (useCallback for event handlers, useRef for DOM manipulation)
// - Component Lifecycle (useEffect for animation control)
// - Event Handling (play/pause controls, speed adjustment)
// - Conditional Rendering (different animation types)
// - Custom Hooks Pattern (animation logic)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import './AnimationSequences.css';

// REACT CONCEPT: Custom Hook for Animation Control
const useAnimationControl = (duration = 5000, isPlaying = false) => {
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const intervalRef = useRef(null);
  
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (duration / 100));
          if (newProgress >= 100) {
            setCurrentFrame(0);
            return 0;
          }
          return newProgress;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration]);
  
  return { progress, currentFrame };
};

// REACT CONCEPT: Derivative Animation Component
const DerivativeAnimation = ({ isPlaying, onComplete }) => {
  const { progress } = useAnimationControl(6000, isPlaying);
  const [showTangent, setShowTangent] = useState(false);
  const [showSlope, setShowSlope] = useState(false);
  
  useEffect(() => {
    if (progress > 20) setShowTangent(true);
    if (progress > 50) setShowSlope(true);
    if (progress >= 100) onComplete?.();
  }, [progress, onComplete]);
  
  return (
    <div className="animation-container">
      <div className="animation-title">Derivative Concept: Slope of Tangent Line</div>
      
      <div className="derivative-animation">
        <svg viewBox="0 0 400 300" className="animation-svg">
          {/* Function curve */}
          <motion.path
            d="M 50 200 Q 200 50 350 200"
            stroke="#3b82f6"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          
          {/* Moving point */}
          <motion.circle
            cx={50 + (progress / 100) * 300}
            cy={200 - (progress / 100) * 150}
            r="6"
            fill="#ef4444"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          
          {/* Tangent line */}
          <AnimatePresence>
            {showTangent && (
              <motion.line
                x1={50 + (progress / 100) * 300 - 50}
                y1={200 - (progress / 100) * 150 - 25}
                x2={50 + (progress / 100) * 300 + 50}
                y2={200 - (progress / 100) * 150 + 25}
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </AnimatePresence>
          
          {/* Slope triangle */}
          <AnimatePresence>
            {showSlope && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <line
                  x1={50 + (progress / 100) * 300}
                  y1={200 - (progress / 100) * 150}
                  x2={50 + (progress / 100) * 300 + 30}
                  y2={200 - (progress / 100) * 150}
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
                <line
                  x1={50 + (progress / 100) * 300 + 30}
                  y1={200 - (progress / 100) * 150}
                  x2={50 + (progress / 100) * 300 + 30}
                  y2={200 - (progress / 100) * 150 - 15}
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
                <text
                  x={50 + (progress / 100) * 300 + 35}
                  y={200 - (progress / 100) * 150 - 8}
                  fill="#f59e0b"
                  fontSize="12"
                >
                  Δy/Δx
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
        
        <div className="animation-explanation">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h4>Step 1: Function Curve</h4>
            <p>The red dot moves along the function curve</p>
          </motion.div>
          
          <AnimatePresence>
            {showTangent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h4>Step 2: Tangent Line</h4>
                <p>The green dashed line shows the tangent at each point</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {showSlope && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h4>Step 3: Slope Calculation</h4>
                <p>The yellow triangle shows Δy/Δx, which is the derivative</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// REACT CONCEPT: Integration Animation Component
const IntegrationAnimation = ({ isPlaying, onComplete }) => {
  const { progress } = useAnimationControl(8000, isPlaying);
  const [showRiemann, setShowRiemann] = useState(false);
  const [showArea, setShowArea] = useState(false);
  
  useEffect(() => {
    if (progress > 15) setShowRiemann(true);
    if (progress > 60) setShowArea(true);
    if (progress >= 100) onComplete?.();
  }, [progress, onComplete]);
  
  const rectangles = Array.from({ length: 20 }, (_, i) => i);
  
  return (
    <div className="animation-container">
      <div className="animation-title">Integration Concept: Area Under Curve</div>
      
      <div className="integration-animation">
        <svg viewBox="0 0 400 300" className="animation-svg">
          {/* Function curve */}
          <motion.path
            d="M 50 200 Q 200 50 350 200"
            stroke="#3b82f6"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          
          {/* Riemann rectangles */}
          <AnimatePresence>
            {showRiemann && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {rectangles.map((i) => {
                  const x = 50 + (i / 19) * 300;
                  const y = 200 - (i / 19) * 150;
                  const width = 300 / 19;
                  const height = 200 - y;
                  
                  return (
                    <motion.rect
                      key={i}
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill="#10b981"
                      opacity={0.3}
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ duration: 0.1, delay: i * 0.05 }}
                    />
                  );
                })}
              </motion.g>
            )}
          </AnimatePresence>
          
          {/* Area fill */}
          <AnimatePresence>
            {showArea && (
              <motion.path
                d="M 50 200 Q 200 50 350 200 L 350 200 L 50 200 Z"
                fill="#3b82f6"
                opacity={0.2}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 1 }}
              />
            )}
          </AnimatePresence>
        </svg>
        
        <div className="animation-explanation">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h4>Step 1: Function Curve</h4>
            <p>We want to find the area under this curve</p>
          </motion.div>
          
          <AnimatePresence>
            {showRiemann && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h4>Step 2: Riemann Sum</h4>
                <p>Approximate the area using rectangles</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {showArea && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h4>Step 3: Exact Area</h4>
                <p>As rectangles get thinner, we get the exact area = integral</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// REACT CONCEPT: Main Animation Sequences Component
const AnimationSequences = () => {
  const [currentAnimation, setCurrentAnimation] = useState('derivative');
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  const animations = [
    { id: 'derivative', name: 'Derivative Concept', component: DerivativeAnimation },
    { id: 'integration', name: 'Integration Concept', component: IntegrationAnimation },
  ];
  
  const CurrentAnimationComponent = animations.find(a => a.id === currentAnimation)?.component;
  
  // REACT CONCEPT: Event Handling with useCallback
  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);
  
  const handleReset = useCallback(() => {
    setIsPlaying(false);
    // Reset will be handled by individual animation components
  }, []);
  
  const handleAnimationComplete = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  const handleSpeedChange = useCallback((speed) => {
    setAnimationSpeed(speed);
  }, []);
  
  return (
    <div className="animation-sequences">
      <div className="sequences-header">
        <h2>Mathematical Concept Animations</h2>
        <p>Watch interactive demonstrations of key mathematical concepts</p>
      </div>
      
      <div className="animation-controls">
        <div className="control-group">
          <button 
            className={`control-btn ${isPlaying ? 'playing' : ''}`}
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <button className="control-btn" onClick={handleReset}>
            <RotateCcw size={18} />
            Reset
          </button>
          
          <button 
            className="control-btn"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
        
        <div className="control-group">
          <label>Speed:</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            className="speed-slider"
          />
          <span>{animationSpeed}x</span>
        </div>
      </div>
      
      <div className="animation-selector">
        {animations.map((animation) => (
          <button
            key={animation.id}
            className={`animation-tab ${currentAnimation === animation.id ? 'active' : ''}`}
            onClick={() => setCurrentAnimation(animation.id)}
          >
            {animation.name}
          </button>
        ))}
      </div>
      
      <div className="animation-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAnimation}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {CurrentAnimationComponent && (
              <CurrentAnimationComponent
                isPlaying={isPlaying}
                onComplete={handleAnimationComplete}
                speed={animationSpeed}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnimationSequences;
