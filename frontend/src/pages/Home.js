// src/pages/Home.js
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Calculator, TrendingUp, Zap, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import "./Home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      features: [
        { icon: Calculator, title: "Step-by-Step Solutions", description: "Get detailed explanations for algebraic and calculus problems" },
        { icon: TrendingUp, title: "Interactive Visualization", description: "See function graphs and mathematical concepts visually" },
        { icon: Zap, title: "Real-Time Solving", description: "Instant mathematical computation with live feedback" },
        { icon: BookOpen, title: "Multiple Topics", description: "Supports algebra, calculus, derivatives, and integrals" },
      ],
      exampleProblems: ["x² + 2x + 1", "derivative(x³, x)", "integral(x², x)", "solve(x² - 4, x)"],
      mounted: false,
    };
  }

  componentDidMount() {
    // Called after component is mounted
    console.log("Home component mounted");
    // e.g., fetch data or start timers here
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    // Called before component is unmounted
    console.log("Home component will unmount");
    // e.g., cleanup timers or subscriptions here
  }

  render() {
    const { features, exampleProblems } = this.state;

    return (
      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1>Advanced Math Solver</h1>
            <p>Solve complex equations with step-by-step explanations and visualizations.</p>
            <div className="hero-buttons">
              <Link to="/solver" className="btn"><Calculator size={16} /> Start Solving <ArrowRight size={16} /></Link>
              <Link to="/visualization" className="btn"><TrendingUp size={16} /> Explore Graphs</Link>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <h2>Powerful Mathematical Tools</h2>
            <p>Everything you need to understand and solve mathematical problems</p>
          </motion.div>
          <div className="features-list">
            {features.map((feature, i) => (
              <motion.div key={feature.title} className="feature-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                <feature.icon size={20} />
                <strong>{feature.title}</strong>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Examples Section */}
        <section className="examples-section">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
            <h2>Try These Examples</h2>
            <div className="examples-list">
              {exampleProblems.map((problem, i) => (
                <motion.div key={problem} className="example-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}>
                  <code>{problem}</code>
                </motion.div>
              ))}
            </div>
            <Link to="/solver" className="btn">Try Now <ArrowRight size={16} /></Link>
          </motion.div>
        </section>
      </main>
    );
  }
}

export default Home;
