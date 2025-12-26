import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview, getProfile } from '../services/api';
import '../styles/reviews.css';

export default function GiveReview() {
  const [form, setForm] = useState({
    rating: 0,
    reviewText: '',
    location: '',
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const data = await getProfile();
      setUser(data.user);
    } catch (err) {
      setError('Failed to load profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (rating) => {
    setForm({ ...form, rating });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Location is required
    if (!form.location || !form.location.trim()) {
      setError('Location is required');
      return;
    }

    // Validation: if reviewText is provided, rating must be provided
    if (form.reviewText.trim() && !form.rating) {
      setError('Rating is required when you write a review');
      return;
    }

    // At least rating or review text must be provided
    if (!form.rating && !form.reviewText.trim()) {
      setError('Please provide either a rating or a review');
      return;
    }

    try {
      setSubmitting(true);
      console.log('Submitting review payload', {
        rating: form.rating || null,
        reviewText: form.reviewText.trim() || null,
        location: form.location.trim(),
      });
      await createReview({
        rating: form.rating || null,
        reviewText: form.reviewText.trim() || null,
        location: form.location.trim(),
      });
      // notify reviews page to refresh and navigate back to reviews
      try {
        window.dispatchEvent(new Event('reviews:updated'));
      } catch (e) {
        // ignore if window not available in some environments
      }
      navigate('/reviews');
    } catch (err) {
      console.error('Failed to submit review', err);
      // Provide a clearer error message when possible, including status/body
      if (err && err.status) {
        setError(`Failed to submit review (${err.status}): ${err.body?.message || JSON.stringify(err.body)}`);
      } else {
        setError(err.message || 'Failed to submit review.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="give-review-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="give-review-container">
      <button className="btn-back" onClick={() => navigate('/reviews')}>
        ← Back to Reviews
      </button>

      <div className="give-review-card">
        {/* User Profile Section */}
        {user && (
          <div className="user-profile-section">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="user-profile-avatar"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : null}
            <div className="user-profile-info">
              <h2 className="user-profile-name">{user.name}</h2>
              <p className="user-profile-email">{user.email}</p>
            </div>
          </div>
        )}

        <div className="form-divider"></div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="review-form">
          <h1 className="form-title">Share Your Travel Experience</h1>

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <span className="alert-icon">✓</span>
              Review submitted successfully! Redirecting...
            </div>
          )}

          {/* Location Field */}
          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="e.g., Ahsan Manzil, Lalbagh Fort or any location you visited"
              value={form.location}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          {/* Rating Section */}
          <div className="form-group">
            <label className="form-label">
              Rating
              {form.reviewText.trim() && <span className="required-badge">*Required</span>}
            </label>
            <div className="rating-selector">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`rating-star ${form.rating >= star ? 'active' : ''}`}
                  onClick={() => handleRatingChange(star)}
                  title={`${star} Star${star !== 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
              {form.rating > 0 && (
                <span className="rating-display">{form.rating}/5 - {getRatingLabel(form.rating)}</span>
              )}
            </div>
          </div>

          {/* Review Text Field */}
          <div className="form-group">
            <label htmlFor="reviewText" className="form-label">
              Your Review (Optional)
              {!form.reviewText && form.rating && (
                <span className="optional-note">(Rating only is fine!)</span>
              )}
            </label>
            <textarea
              id="reviewText"
              name="reviewText"
              placeholder="Share your thoughts about thislocation or place... (at least 10 characters if provided)"
              value={form.reviewText}
              onChange={handleInputChange}
              className="form-textarea"
              rows="6"
            />
            {form.reviewText && (
              <div className="char-count">
                {form.reviewText.length} characters
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-submit"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>

          <p className="form-hint">
            💡 Tip: Your review helps other travelers make informed decisions. Be honest and constructive!
          </p>
        </form>
      </div>
    </div>
  );
}

function getRatingLabel(rating) {
  const labels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };
  return labels[rating] || '';
}
