import React from 'react';
import './Testimonials.css';

const Testimonials = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const testimonial = testimonials[0];

  return (
    <section id="testimonials" className="testimonials-section reveal">
      <h2>Testimonials</h2>
      <div className="testimonial-content">
        <span className="quote-mark material-symbols-outlined">format_quote</span>
        <p className="quote">{testimonial.quote}</p>
        <p className="author">{testimonial.author}</p>
      </div>
    </section>
  );
};

export default Testimonials;
