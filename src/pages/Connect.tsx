// src/components_front/ConnectUs.tsx
import React, { useState } from 'react';
import '../styles/Connect.css';

interface Props {
  onBack: () => void;
  onReturnHome: () => void;
}

const ConnectUs: React.FC<Props> = ({ onBack, onReturnHome }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onReturnHome();
    }, 2000);
  };

  return (
    <div className="connect-wrapper">
      {/* Header remains visible always */}
      <div className="connect-header">
        <h1>Connect with me! </h1>
        <button className="back-button" onClick={onBack}>← Back</button>
      </div>

      {/* Form OR Thank-you Message */}
      {!submitted ? (
        <form className="connect-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input id="name" type="text" placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input id="email" type="email" placeholder="john@example.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea id="message" placeholder="Write your message..." required />
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      ) : (
        <div className="thank-you-message">
          <h2>Thanks for connecting!</h2>
          <p>Redirecting to home...</p>
        </div>
      )}
    </div>
  );
};

export default ConnectUs;
