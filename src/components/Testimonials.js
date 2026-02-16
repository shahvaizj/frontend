import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import './Testimonials.css';

const Testimonials = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // New state for pause functionality
  const timeoutRef = useRef(null); // Ref to hold the timeout ID

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsPaused(false); // Resume playback if manually changed slide
  };

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Auto-sliding effect
  useEffect(() => {
    resetTimeout(); // Clear any existing timeout

    if (testimonials.length > 1 && !isPaused) {
      timeoutRef.current = setTimeout(() => {
        goToNext();
      }, 5000); // Slide every 5 seconds
    }

    return () => {
      resetTimeout(); // Clear timeout on component unmount or re-render
    };
  }, [currentIndex, testimonials.length, isPaused]); // Re-run effect if current slide, total slides, or pause state changes

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const togglePlayPause = () => setIsPaused(!isPaused); // Toggle play/pause state

  if (!testimonials || testimonials.length === 0) {
    return (
      <section id="testimonials" className="testimonials-section">
        <h2>Testimonials</h2>
        <p>No testimonials available.</p>
      </section>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="testimonials-section">
      <h2>Testimonials</h2>
      <div className="testimonial-slider-container"
           onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave}
      >
        <div key={currentIndex} className="testimonial-card">
          <p className="quote">"{currentTestimonial.quote}"</p>
          <p className="author">- {currentTestimonial.author}</p>
        </div>
      </div>
      {testimonials.length > 1 && (
        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentIndex === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      )}
    </section>
  );
};

export default Testimonials;
