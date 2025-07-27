import React, { useState } from 'react';
import '../styles/Connect.css';

interface Props {
  onBack: () => void;
  onReturnHome: () => void;
}

const ConnectUs: React.FC<Props> = ({ onBack, onReturnHome }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://portfolio-backend-igmy.onrender.com/api/feedback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response error:', data);
        alert(data?.error || 'Something went wrong while sending your message.');
        return;
      }

      console.log('Feedback response:', data);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setEmail('');
        setMessage('');
        onReturnHome();
      }, 2000);

    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      alert('Failed to send your message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="connect-wrapper">
      <div className="connect-header">
        <h1>Connect with me!</h1>
        <button className="back-button" onClick={onBack} aria-label="Go back">← Back</button>
      </div>

      {!submitted ? (
        <form className="connect-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              aria-required="true"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              aria-required="true"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={loading}
              aria-required="true"
              rows={5}
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Sending...' : 'Submit'}
          </button>
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
