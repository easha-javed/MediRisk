import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Heart, Brain, TrendingUp, Shield, Zap, Users } from 'lucide-react';
import '../styles/HomePage.css';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI-Powered Insights',
      description: 'Advanced machine learning models trained on millions of health records for accurate predictions.'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Your Health Matters',
      description: 'Personalized risk assessments considering your unique health profile and lifestyle.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Private',
      description: 'Bank-level encryption ensures your sensitive health data stays completely private.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Results',
      description: 'Get comprehensive risk assessments and actionable recommendations in seconds.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Expert Support',
      description: 'Access AI-powered chat with medical insights anytime, anywhere.'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Cardiologist',
      text: 'MediRisk has revolutionized how we identify at-risk patients. The accuracy is remarkable.',
      
    },
    {
      name: 'James Wilson',
      role: 'Patient',
      text: 'This app helped me understand my health risks better. The explanations are so clear.',
      
    },
    {
      name: 'Dr. Priya Patel',
      role: 'Medical Director',
      text: 'The explainability feature is what sets MediRisk apart. Trust is paramount in healthcare.',
      
    }
  ];

  const stats = [
    { number: '10M+', label: 'Predictions Made' },
    { number: '99.2%', label: 'Accuracy Rate' },
    { number: '50K+', label: 'Active Users' },
    { number: '24/7', label: 'AI Support' }
  ];

  return (
    <div className="homepage-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <div className="logo-icon">♦</div>
            <span>MediRisk</span>
          </div>

          {/* Desktop Menu */}
          <div className="nav-menu-desktop">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
            
          </div>

          {/* CTA Buttons */}
          <div className="nav-buttons">
  <Link to="/login">
    <button className="btn-secondary">Sign In</button>
  </Link>

  <Link to="/register">
    <button className="btn-primary">Get Started</button>
  </Link>
</div>

          {/* Mobile Menu Toggle */}
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#pricing">Pricing</a>
            <button className="btn-primary w-full">Get Started</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">AI-Powered Disease Risk Prediction</div>
          <h1 className="hero-title">
            Your Health. Predicted.
            <span className="gradient-text"> Explained.</span>
          </h1>
          <p className="hero-subtitle">
            Advanced AI-powered disease risk prediction with explainable, human-readable insights. Know your risks before they become reality.
          </p>
          <div className="hero-buttons">
            <Link to="/login">
  <button className="btn-primary-lg">
    Start Prediction
    <ArrowRight size={20} />
  </button>
</Link>
            
          </div>
        </div>

        {/* Hero Background Elements */}
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="grid-pattern"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-item" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Powerful Features</h2>
          <p>Everything you need for accurate health risk assessment</p>
        </div>

        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card card-hover">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Three simple steps to understand your health risks</p>
        </div>

        <div className="steps-container">
          {[
            {
              number: '01',
              title: 'Input Your Data',
              description: 'Enter your health metrics, lifestyle factors, and medical history.'
            },
            {
              number: '02',
              title: 'AI Analysis',
              description: 'Our advanced algorithms analyze your data against millions of health records.'
            },
            {
              number: '03',
              title: 'Get Insights',
              description: 'Receive your personalized risk score with clear, actionable recommendations.'
            }
          ].map((step, idx) => (
            <div key={idx} className="step-card">
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {idx < 2 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-header">
          <h2>Trusted by Healthcare Professionals</h2>
          <p>See what doctors and patients say about MediRisk</p>
        </div>

        <div className="testimonials-carousel">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className={`testimonial-card ${activeTestimonial === idx ? 'active' : ''}`}
              onClick={() => setActiveTestimonial(idx)}
            >
              <div className="testimonial-avatar">{testimonial.avatar}</div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <h4>{testimonial.name}</h4>
                <p>{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-indicators">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={`indicator ${activeTestimonial === idx ? 'active' : ''}`}
              onClick={() => setActiveTestimonial(idx)}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Take Control of Your Health?</h2>
          <p>Join thousands of users who are making informed health decisions with MediRisk.</p>
          <Link to="/register">
  <button className="btn-primary-lg">
    Get Started
    <ArrowRight size={20} />
  </button>
</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="logo" style={{ marginBottom: '1rem' }}>
              <div className="logo-icon">♦</div>
              <span>MediRisk</span>
            </div>
            <p>Advanced AI-powered disease risk prediction for healthcare.</p>
          </div>

          <div className="footer-section">
            <h4>Product</h4>
            <a href="#">Features</a>
            
            <a href="#">Security</a>
            <a href="#">API</a>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Compliance</a>
            <a href="#">HIPAA</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 MediRisk. All rights reserved.</p>
          <div className="social-links">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="GitHub">🔗</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
