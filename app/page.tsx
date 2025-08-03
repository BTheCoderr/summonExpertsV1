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
  Target,
  User,
  Building,
  Globe,
  Server,
  Workflow,
  Bot,
  Shield
} from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    businessIdea: '',
    timeline: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    setIsFormOpen(true);
  };

  const handleTextClick = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send data to our API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Lead captured successfully:', result);
        setSubmitSuccess(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
          setIsFormOpen(false);
          setFormData({
            name: '',
            email: '',
            company: '',
            role: '',
            businessIdea: '',
            timeline: '',
            phone: ''
          });
        }, 3000);
      } else {
        console.error('Failed to submit form:', result.error);
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      {/* Lead Capture Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {!submitSuccess ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Get Early Access</h2>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Join our early access program and be among the first to experience the future of business planning.
                </p>
                
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company/Organization
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your Company"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select your role</option>
                      <option value="founder">Founder</option>
                      <option value="co-founder">Co-Founder</option>
                      <option value="entrepreneur">Entrepreneur</option>
                      <option value="business-owner">Business Owner</option>
                      <option value="startup-employee">Startup Employee</option>
                      <option value="consultant">Consultant</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Idea/Project
                    </label>
                    <textarea
                      name="businessIdea"
                      value={formData.businessIdea}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Briefly describe your business idea or project..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timeline to Launch
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select timeline</option>
                      <option value="immediately">Immediately</option>
                      <option value="1-3-months">1-3 months</option>
                      <option value="3-6-months">3-6 months</option>
                      <option value="6-12-months">6-12 months</option>
                      <option value="12-plus-months">12+ months</option>
                    </select>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </div>
                    ) : (
                      'Get Early Access'
                    )}
                  </button>
                </form>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  We'll contact you within 24 hours to discuss your needs and provide early access.
                </p>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600 mb-4">
                  We've received your early access request. Our team will contact you within 24 hours to discuss your needs and provide access to the platform.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>📧 Check your email for confirmation</p>
                  <p>📞 We'll call you at {formData.phone || formData.email}</p>
                  <p>🚀 Get ready to transform your business!</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

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
          </div>
          
          <div className="nav-actions">
            <ThemeToggle />
            <button
              className="mobile-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                className="mobile-nav-link"
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-title"
            >
              Transform Your Business Idea Into
              <span className="gradient-text"> Reality</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-subtitle"
            >
              AI-powered business planning platform that helps founders and entrepreneurs 
              create comprehensive strategies, identify hurdles, and execute with confidence.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hero-stats"
            >
              <div className="stat">
                <div className="stat-number">50+</div>
                <div className="stat-label">Strategic Plans Generated</div>
              </div>
              <div className="stat">
                <div className="stat-number">85%</div>
                <div className="stat-label">User Satisfaction</div>
              </div>
              <div className="stat">
                <div className="stat-number">5min</div>
                <div className="stat-label">Setup Time</div>
              </div>
            </motion.div>
            
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

      {/* Advanced Features Section */}
      <section className="section advanced-features">
        <div className="container">
          <div className="section-content">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              Advanced Agent Fleet Features
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="section-subtitle text-center"
            >
              Production-ready multi-agent orchestration with enterprise-grade security
            </motion.p>
            
            <div className="features-grid">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="feature-card"
              >
                <Link href="/fleet-dashboard" className="feature-link">
                  <div className="feature-icon">
                    <Server size={32} />
                  </div>
                  <h3>Fleet Dashboard</h3>
                  <p>Real-time monitoring, health checks, auto-scaling, and performance analytics for your agent fleet</p>
                  <div className="feature-tags">
                    <span className="tag">Monitoring</span>
                    <span className="tag">Auto-scaling</span>
                    <span className="tag">Analytics</span>
                  </div>
                </Link>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="feature-card"
              >
                <Link href="/workflow-builder" className="feature-link">
                  <div className="feature-icon">
                    <Workflow size={32} />
                  </div>
                  <h3>Visual Workflow Builder</h3>
                  <p>Drag-and-drop interface for creating complex multi-agent workflows with conditional routing</p>
                  <div className="feature-tags">
                    <span className="tag">Visual Builder</span>
                    <span className="tag">Drag & Drop</span>
                    <span className="tag">Conditional Logic</span>
                  </div>
                </Link>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="feature-card"
              >
                <Link href="/agent-test" className="feature-link">
                  <div className="feature-icon">
                    <Bot size={32} />
                  </div>
                  <h3>Agent CLI</h3>
                  <p>Interactive command-line interface for testing and debugging agent interactions in real-time</p>
                  <div className="feature-tags">
                    <span className="tag">CLI</span>
                    <span className="tag">Testing</span>
                    <span className="tag">Debugging</span>
                  </div>
                </Link>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="feature-card"
              >
                <Link href="/demo" className="feature-link">
                  <div className="feature-icon">
                    <Shield size={32} />
                  </div>
                  <h3>Security & Trust</h3>
                  <p>Enterprise-grade authentication, authorization, input validation, and comprehensive audit trails</p>
                  <div className="feature-tags">
                    <span className="tag">Authentication</span>
                    <span className="tag">Authorization</span>
                    <span className="tag">Audit Trails</span>
                  </div>
                </Link>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                viewport={{ once: true }}
                className="feature-card"
              >
                <Link href="/mvp" className="feature-link">
                  <div className="feature-icon">
                    <Zap size={32} />
                  </div>
                  <h3>Multi-Agent MVP</h3>
                  <p>Test the core 3-agent pipeline with retry logic, forking, and output selection</p>
                  <div className="feature-tags">
                    <span className="tag">MVP</span>
                    <span className="tag">Pipeline</span>
                    <span className="tag">Testing</span>
                  </div>
                </Link>
              </motion.div>
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