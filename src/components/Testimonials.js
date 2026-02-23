import React, { useState } from 'react';
import './Testimonials.css';

const Testimonials = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) {
    return (
      <section id="testimonials" className="testimonials-section">
        <h2>Testimonials</h2>
        <p>No testimonials available.</p>
      </section>
    );
  }

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section id="testimonials" className="testimonials-section">
      <h2>Testimonials</h2>
      <div className="testimonials-carousel">
        <div className="testimonials-viewport">
          <div 
            className="testimonials-track" 
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-slide">
                <div className="testimonial-content">
                  <p className="quote">"{testimonial.quote}"</p>
                  <p className="author">- {testimonial.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="testimonial-dots">
        {testimonials.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
