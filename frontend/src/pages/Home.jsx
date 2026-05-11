import React from 'react';
import './Home.css';
import bannerImage from '../assets/ChatGPT Image May 11, 2026, 12_28_13 AM.png';

function Home() {
  return (
    <div className="home-page">
      <section className="banner-section">
        <img src={bannerImage} alt="UPG Banner" className="banner-image" />
      </section>

      <section className="hero">
        <div className="hero-content">
          <h2>Welcome to UPG</h2>
          <p>Harness the Power of the Sun</p>
          <div className="hero-description">
            <h3>Revolutionary Solar Energy Solutions</h3>
            <p>
              UPG Universal Power Generation is committed to providing sustainable and efficient
              solar energy solutions for homes and businesses worldwide.
            </p>
            <div className="features">
              <div className="feature-card">
                <h4>🔆 High Efficiency</h4>
                <p>Maximum energy conversion with cutting-edge technology</p>
              </div>
              <div className="feature-card">
                <h4>💰 Cost-Effective</h4>
                <p>Affordable solar solutions for everyone</p>
              </div>
              <div className="feature-card">
                <h4>🌍 Eco-Friendly</h4>
                <p>Clean energy for a sustainable future</p>
              </div>
              <div className="feature-card">
                <h4>🛠️ Expert Support</h4>
                <p>24/7 technical support and maintenance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="team-container">
          <h2>Our Team</h2>
          <div className="team-cards">
            <div className="team-card">
              <div className="team-role">👔 Boss</div>
              <h3>Syed Nasir Ali</h3>
            </div>
            <div className="team-card">
              <div className="team-role">📋 Manager</div>
              <h3>Adnanzaidi</h3>
            </div>
            <div className="team-card">
              <div className="team-role">🤝 Assistant</div>
              <h3>Abid</h3>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <h3>UPG - Universal Power Generation</h3>
            <p>Sustainable Solar Energy Solutions</p>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <a href="mailto:universalpowergeneration1974@gmail.com">📧 universalpowergeneration1974@gmail.com</a>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://facebook.com/upg1974" target="_blank" rel="noopener noreferrer">📘 Facebook</a>
              <a href="https://twitter.com/upg1974" target="_blank" rel="noopener noreferrer">𝕏 Twitter</a>
              <a href="https://instagram.com/upg1974" target="_blank" rel="noopener noreferrer">📷 Instagram</a>
              <a href="https://linkedin.com/company/upg1974" target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 UPG. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
