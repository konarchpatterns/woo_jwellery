import React, { useState } from "react";
import "./Features.css";

const Features = () => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handleMouseMove = (e) => {
    if (e.buttons !== 1) return;
    handleSliderChange(e);
  };

  return (
    <>
      {/* Nap Earrings Section */}
      <section className="nap-earrings-section" id="nap-earrings">
        <div className="container">
          <h2 className="section-title">MEET NAP EARRINGS®</h2>
          <p className="section-subtitle">
            Flat back earrings in medical grade titanium, engineered for lobe
            piercings
          </p>

          {/* Before/After Slider */}
          <div
            className="comparison-slider"
            onMouseDown={handleSliderChange}
            onMouseMove={handleMouseMove}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.max(
                0,
                Math.min(touch.clientX - rect.left, rect.width)
              );
              const percent = (x / rect.width) * 100;
              setSliderPosition(percent);
            }}
          >
            {/* Before Image (Left Side) */}
            <div className="slider-image-wrapper before">
              <img
                src="https://www.maisonmiru.com/cdn/shop/files/blue-topaz-nap-earrings-eleonora-900_1200x1200.jpg?v=1701375592"
                alt="Before Nap Earrings"
                className="slider-image"
                loading="eager"
              />
              <div className="slider-label left">BEFORE NAP EARRINGS®</div>
            </div>

            {/* After Image (Right Side) with Clip */}
            <div
              className="slider-image-wrapper after"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src="https://mm-cdn.imgix.net/cdn/shop/files/ruby-opal-nap-earrings-eleonora-900.jpg?v=1760057143&auto=format,compress&fit=max&w=900"
                alt="After Nap Earrings"
                className="slider-image"
                loading="eager"
              />
              <div className="slider-label right">AFTER NAP EARRINGS®</div>
            </div>

            {/* Slider Handle */}
            <div
              className="slider-handle"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="slider-button">
                <span className="arrow-left">‹</span>
                <span className="arrow-right">›</span>
              </div>
            </div>
          </div>

          {/* Buttons Below Slider */}
          <div className="comparison-buttons">
            <button className="comparison-btn">NAP EARRINGS 101</button>
            <button className="comparison-btn primary">
              SHOP NAP EARRINGS
            </button>
          </div>
        </div>
      </section>

      {/* As Seen On Section */}
      <section className="as-seen-on">
        <div className="container">
          <h2 className="section-title">AS SEEN ON</h2>
          <div className="press-logos">
            <div className="press-logo">VOGUE</div>
            <div className="press-logo">THE COVETEUR</div>
            <div className="press-logo">THE ZOE REPORT</div>
            <div className="press-logo">GOOP</div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section" id="about">
        <div className="container">
          <div className="founder-content">
            <div className="founder-image">
              <div className="founder-placeholder"></div>
            </div>
            <div className="founder-text">
              <h2>DESIGNED WITH ❤️ IN NYC</h2>
              <p>
                Founded by a former engineer, Maison Miru is an independent
                design studio with systems and modularity at its core.
              </p>
              <button className="cta-button-outline">MEET TRISHA</button>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 4L28.4 16.8L42 18.6L31.8 27.6L35 42L24 35L13 42L16.2 27.6L6 18.6L19.6 16.8L24 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Everyday essentials reimagined</h3>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 8C24 8 16 14 16 22C16 26.4 19.6 30 24 30C28.4 30 32 26.4 32 22C32 14 24 8 24 8Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M24 30V44"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 44H34"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Designed with love in NYC</h3>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="6"
                    y="14"
                    width="36"
                    height="26"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 14V10C14 7.8 15.8 6 18 6H30C32.2 6 34 7.8 34 10V14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 22H42"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Free Shipping over $150</h3>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 4L26.8 14.4L36 12L30.4 20.8L40 24L30.4 27.2L36 36L26.8 33.6L24 44L21.2 33.6L12 36L17.6 27.2L8 24L17.6 20.8L12 12L21.2 14.4L24 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Safe for sensitive skin</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="instagram-section">
        <div className="container">
          <h2 className="section-title">@MAISONMIRU ON INSTAGRAM</h2>
          <div className="instagram-grid">
            <div className="instagram-post">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80"
                alt="Instagram post 1"
                className="instagram-image"
              />
            </div>
            <div className="instagram-post">
              <img
                src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80"
                alt="Instagram post 2"
                className="instagram-image"
              />
            </div>
            <div className="instagram-post">
              <img
                src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80"
                alt="Instagram post 3"
                className="instagram-image"
              />
            </div>
            <div className="instagram-post">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80"
                alt="Instagram post 4"
                className="instagram-image"
              />
            </div>
            <div className="instagram-post">
              <img
                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&q=80"
                alt="Instagram post 5"
                className="instagram-image"
              />
            </div>
            <div className="instagram-post">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80"
                alt="Instagram post 6"
                className="instagram-image"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
