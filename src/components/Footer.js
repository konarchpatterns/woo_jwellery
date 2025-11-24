import React, { useState } from "react";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
          <h2>WE ALSO MAKE EMAILS 💌</h2>
          <p>
            For first access to new designs, a sneak peek at what's happening in
            the studio, and first dibs on our twice yearly sample sale, get on
            the list!
          </p>
          <p className="newsletter-tags">#NOSPAM #NOBADVIBES</p>
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">SUBSCRIBE</button>
          </form>
        </div>
      </section>

      {/* Footer Links */}
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <h3>CUSTOMER CARE</h3>
              <ul>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
                <li>
                  <a href="#returns">Returns and Exchanges</a>
                </li>
                <li>
                  <a href="#how-to-wear">How to Wear Piercing Jewelry</a>
                </li>
                <li>
                  <a href="#sizing">Jewelry Sizing Guide</a>
                </li>
                <li>
                  <a href="#loyalty">Loyalty Program</a>
                </li>
                <li>
                  <a href="#contact">Contact Us</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>THE FINE PRINT</h3>
              <ul>
                <li>
                  <a href="#terms">Terms and Conditions</a>
                </li>
                <li>
                  <a href="#privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="#dmca">DMCA Policy</a>
                </li>
                <li>
                  <a href="#accessibility">Accessibility</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>ABOUT MAISON MIRU</h3>
              <ul>
                <li>
                  <a href="#story">Our Story</a>
                </li>
                <li>
                  <a href="#team">Meet the Team</a>
                </li>
                <li>
                  <a href="#careers">Careers</a>
                </li>
                <li>
                  <a href="#press">Press & Reviews</a>
                </li>
                <li>
                  <a href="#affiliates">Affiliates</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>MISSION</h3>
              <p>
                Maison Miru creates modular jewelry that balances form and
                function — designed with purpose, built for everyday wear, and
                gentle on sensitive skin.
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="social-links">
            <a href="#facebook" aria-label="Facebook">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="#instagram" aria-label="Instagram">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href="#pinterest" aria-label="Pinterest">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>
            <a href="#tiktok" aria-label="TikTok">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="footer-bottom">
            <p>© 2025 - Maison Miru</p>
            <p className="promotion-details">
              Excludes Lab Grown Diamond Nap Earrings, Gift Cards, and
              Checkout+. Ends 12/1.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
