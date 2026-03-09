import React, { useState, useEffect } from 'react';
import './Testimonials.css';

const Testimonials = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!testimonials || testimonials.length < 2) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0) {
    return (
      <section id="testimonials" className="testimonials-section reveal">
        <h2>Testimonials</h2>
        <p>No testimonials available.</p>
      </section>
    );
  }

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className="testimonials-section reveal">
      <h2>Testimonials</h2>
      <div className="testimonials-carousel">
        <button className="testimonial-arrow left" onClick={goPrev} aria-label="Previous testimonial">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <div className="testimonials-viewport">
          <div className="testimonials-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-slide">
                <div className="testimonial-content">
                  <span className="quote-mark material-symbols-outlined">format_quote</span>
                  <p className="quote">{testimonial.quote}</p>
                  <p className="author">{testimonial.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="testimonial-arrow right" onClick={goNext} aria-label="Next testimonial">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
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
