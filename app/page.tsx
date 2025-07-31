'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  Brain, 
  Wrench, 
  Calendar, 
  Briefcase, 
  CheckCircle, 
  ArrowRight, 
  Phone, 
  Mail, 
  Github, 
  Linkedin, 
  ExternalLink,
  Menu,
  X,
  MessageCircle,
  Rocket,
  Zap,
  Target
} from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'what-we-build', 'who-its-for', 'what-you-get', 'why-different', 'why-trust', 'early-offer'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleCTAClick = () => {
    scrollToSection('early-offer');
  };

  const handleTextClick = () => {
    scrollToSection('early-offer');
  };

  const navItems = [
    { id: 'what-we-build', label: 'What We Build' },
    { id: 'who-its-for', label: 'Who It\'s For' },
    { id: 'what-you-get', label: 'What You Get' },
    { id: 'why-different', label: 'Why Different' },
    { id: 'why-trust', label: 'Why Trust Us' },
    { id: 'early-offer', label: 'Early Offer' }
  ];

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <motion.div 
            className="nav-logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="logo-text">Summon Experts</div>
          </motion.div>
          
          <div className="nav-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
            <Link href="/demo" className="nav-link cta-nav">
              Try Demo
            </Link>
            <ThemeToggle />
          </div>
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="mobile-menu">
            {navItems.map((item) => (
              <button
                key={item.id}
                className="mobile-nav-link"
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
            <Link href="/demo" className="mobile-nav-link cta-nav">
              Try Demo
            </Link>
            <div className="mobile-nav-link">
              <ThemeToggle />
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="container">
          <div className="hero-content">
            <motion.h1 
              className="hero-headline"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              AI-Powered Business Execution Platform
            </motion.h1>
            
            <motion.p 
              className="hero-subheadline"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Transform your business ideas into actionable plans with AI-driven insights, strategic roadmaps, and automated task management.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button className="cta-button primary" onClick={handleCTAClick}>
                Get Early Access
                <ArrowRight size={20} />
              </button>
              <Link href="/demo" className="cta-button">
                <Rocket size={20} />
                Try Demo
              </Link>
              <Link href="/dashboard" className="cta-button">
                <Zap size={20} />
                Full Platform
              </Link>
            </motion.div>
            
            <div className="contact-info">
              <p>
                Questions? <span className="text-link" onClick={handleTextClick}>Contact us</span> or call <a href="tel:+18574078886" className="text-link">+1 (857) 407-8886</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We're Building */}
      <section id="what-we-build" className="section">
        <div className="container">
          <div className="section-content">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              What We're Building
            </motion.h2>
            
            <div className="content-grid">
              <div className="content-text">
                <p>
                  Summon Experts is an AI-powered platform that helps founders and entrepreneurs transform their business ideas into executable strategies. 
                  We combine advanced AI analysis with proven business frameworks to create comprehensive roadmaps, identify strategic hurdles, 
                  and generate actionable weekly tasks.
                </p>
                <p>
                  Our platform bridges the gap between vision and execution, providing the tools and insights needed to build successful, 
                  scalable businesses in today's competitive landscape.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section id="who-its-for" className="section bg-light">
        <div className="container">
          <div className="section-content">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Who It's For
            </motion.h2>
            
            <div className="cards-grid">
              <motion.div 
                className="card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Briefcase size={32} />
                <h3>Early-Stage Founders</h3>
                <p>Turn your startup idea into a structured business plan with clear milestones and actionable steps.</p>
              </motion.div>
              
              <motion.div 
                className="card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Brain size={32} />
                <h3>Entrepreneurs</h3>
                <p>Scale your existing business with AI-driven insights and strategic planning tools.</p>
              </motion.div>
              
              <motion.div 
                className="card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Calendar size={32} />
                <h3>Business Teams</h3>
                <p>Align your team around clear objectives with automated task management and progress tracking.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section id="what-you-get" className="section">
        <div className="container">
          <div className="section-content">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              What You Get
            </motion.h2>
            
            <div className="features-grid">
              <motion.div 
                className="feature"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="feature-icon">
                  <Brain size={24} />
                </div>
                <h3>AI-Powered Analysis</h3>
                <p>Get intelligent insights and recommendations based on your business model and market conditions.</p>
              </motion.div>
              
              <motion.div 
                className="feature"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="feature-icon">
                  <Wrench size={24} />
                </div>
                <h3>Strategic Roadmaps</h3>
                <p>Generate comprehensive business roadmaps with clear milestones and timelines.</p>
              </motion.div>
              
              <motion.div 
                className="feature"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="feature-icon">
                  <CheckCircle size={24} />
                </div>
                <h3>Weekly Task Management</h3>
                <p>Automated task generation and progress tracking to keep you on track.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different */}
      <section id="why-different" className="section bg-light">
        <div className="container">
          <div className="section-content">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Why We're Different
            </motion.h2>
            
            <div className="highlight-box">
              <h3>We don't just <span className="accent">plan</span> - we <span className="accent">execute</span></h3>
              <p>
                Unlike traditional business planning tools, Summon Experts focuses on execution. 
                We provide actionable weekly tasks, strategic hurdle identification, and AI-powered insights 
                that help you move from planning to doing.
              </p>
            </div>
            
            <div className="features-list">
              <div className="feature-item">
                <CheckCircle size={20} />
                <span>AI-driven strategic analysis</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={20} />
                <span>Automated task generation</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={20} />
                <span>Progress tracking and analytics</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={20} />
                <span>Strategic hurdle identification</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section id="why-trust" className="section">
        <div className="container">
          <div className="section-content">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Why Trust Us
            </motion.h2>
            
            <div className="founders-grid">
              <motion.div 
                className="founder-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="founder-avatar">BF</div>
                <h3>Baheem Ferrell</h3>
                <p>Technical Founder & AI Engineer</p>
              </motion.div>
              
              <motion.div 
                className="founder-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="founder-avatar">DA</div>
                <h3>Damola Adediran</h3>
                <p>Business Strategy & Operations</p>
              </motion.div>
            </div>
            
            <div className="trust-info">
              <p>
                Built by founders, for founders. We understand the challenges of building and scaling businesses 
                because we've been there. Our platform combines technical expertise with business acumen 
                to deliver real results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Early Offer */}
      <section id="early-offer" className="section bg-accent">
        <div className="container">
          <div className="section-content">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Early Offer
            </motion.h2>
            
            <div className="offer-content">
              <div className="offer-question">
                <h3>Ready to transform your business?</h3>
              </div>
              
              <div className="offer-details">
                <p>
                  Join our early access program and be among the first to experience the future of business planning. 
                  Limited spots available for founders who want to get ahead.
                </p>
              </div>
              
              <div className="offer-features">
                <div className="offer-feature">
                  <CheckCircle size={20} />
                  <span>Early access to all features</span>
                </div>
                <div className="offer-feature">
                  <CheckCircle size={20} />
                  <span>Direct founder support</span>
                </div>
                <div className="offer-feature">
                  <CheckCircle size={20} />
                  <span>Lifetime pricing guarantee</span>
                </div>
              </div>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <Phone size={20} />
                  <span>
                    <a href="tel:+18574078886">+1 (857) 407-8886</a>
                  </span>
                </div>
                <div className="contact-method">
                  <Mail size={20} />
                  <span>
                    <a href="mailto:info@summonexperts.com">info@summonexperts.com</a>
                  </span>
                </div>
                <div className="contact-method">
                  <MessageCircle size={20} />
                  <span>
                    <Link href="/demo" className="text-link">Try Demo Now</Link>
                  </span>
                </div>
                <div className="contact-method">
                  <Target size={20} />
                  <span>
                    <Link href="/dashboard" className="text-link">Full Platform Access</Link>
                  </span>
                </div>
                <div className="contact-method">
                  <ExternalLink size={20} />
                  <span>
                    <Link href="/test-notion" className="text-link">Test Notion Integration</Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <p>&copy; 2025 Summon Experts. All rights reserved.</p>
            </div>
            
            <div className="contact-links">
              <a href="tel:+18574078886" className="contact-link">
                <Phone size={16} />
                <span>+1 (857) 407-8886</span>
              </a>
              <a href="mailto:info@summonexperts.com" className="contact-link">
                <Mail size={16} />
                <span>info@summonexperts.com</span>
              </a>
            </div>
            
            <div className="social-links">
              <a href="https://github.com/BTheCoderr" target="_blank" rel="noopener noreferrer" className="social-link">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer" className="social-link">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 