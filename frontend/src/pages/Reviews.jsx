import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllReviews } from '../services/api';
import '../styles/reviews.css';

export default function ReviewsFeed() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching all reviews...');
      const data = await getAllReviews();
      console.log('✅ Reviews data received:', data);
      setReviews(data.reviews || []);
    } catch (err) {
      console.error('❌ Error fetching reviews:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Listen for external refresh events (dispatched after creating a review)
  useEffect(() => {
    const handler = () => {
      fetchReviews();
    };
    window.addEventListener('reviews:updated', handler);
    return () => window.removeEventListener('reviews:updated', handler);
  }, [fetchReviews]);

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <div className="reviews-title-section">
          <h1 className="reviews-title">Community Reviews & Feedback</h1>
          <p className="reviews-subtitle">See what other travelers think about their adventures</p>
        </div>
        <div className="reviews-actions">
          <button className="btn-secondary" onClick={() => navigate('/home')}>← Back</button>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading reviews...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <button onClick={fetchReviews} className="btn-retry">Retry</button>
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h2>No reviews yet</h2>
          <p>Be the first to share your travel experience!</p>
          <button className="btn-primary" onClick={() => navigate('/give-review')}>
            Write a Review
          </button>
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info no-avatar">
                  <div className="reviewer-details">
                    <h3 className="reviewer-name">{review.userId?.name || 'Anonymous User'}</h3>
                    {review.location && (
                      <p className="reviewer-location">{review.location}</p>
                    )}
                    <p className="review-date">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                {review.destination && (
                  <span className="destination-badge">{review.destination}</span>
                )}
              </div>

              {review.rating && (
                <div className="review-rating">
                  {renderStars(review.rating)}
                  <span className="rating-number">{review.rating}/5</span>
                </div>
              )}

              {review.reviewText && (
                <p className="review-text">{review.reviewText}</p>
              )}

              {!review.reviewText && review.rating && (
                <p className="review-text" style={{ fontStyle: 'italic', color: '#888' }}>
                  ⭐ {review.rating}-star rating
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Floating corner button to give a review */}
      <button className="fab-give-review" title="Write a review" onClick={() => navigate('/give-review')}>✍️</button>
    </div>
  );
}
