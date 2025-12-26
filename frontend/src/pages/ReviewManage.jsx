import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllReviews, deleteReview } from '../services/api';
import { useNotifications } from '../contexts/NotificationsContext';
import { useConfirm } from '../hooks/useConfirm';
import ConfirmDialog from '../components/ConfirmDialog';
import '../styles/admin.css';

export default function ReviewManage() {
  const navigate = useNavigate();
  const { add: notify } = useNotifications();
  const { confirmState, confirm } = useConfirm();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllReviews();
      setReviews(data.reviews || []);
    } catch (err) {
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: 'Delete Review',
      message: 'Are you sure you want to delete this review? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteReview(id);
      setReviews(prev => prev.filter(r => r._id !== id));
      notify('Review deleted successfully', { type: 'success' });
    } catch (err) {
      notify(err.message || 'Delete failed', { type: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = reviews.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (r.userId?.name || '').toLowerCase().includes(q) || (r.userId?.email || '').toLowerCase().includes(q);
  });

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            <span className="admin-title-icon">💬</span>
            Review Management
          </h1>
          <p className="admin-subtitle">Manage and moderate user reviews</p>
        </div>
        <div className="admin-actions">
          <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/admin')}>
            ← Back to Admin
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">
            <span className="admin-card-icon">🔍</span>
            All Reviews ({reviews.length})
          </h2>
        </div>

        <div className="admin-search-bar">
          <input
            className="admin-search-input"
            placeholder="🔎 Search by reviewer name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="admin-btn admin-btn-secondary"
              onClick={() => setSearch('')}
            >
              Clear
            </button>
          )}
        </div>

        {loading && (
          <div className="admin-loading">
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
            <p>Loading reviews...</p>
          </div>
        )}

        {error && (
          <div className="admin-empty-state">
            <div className="admin-empty-state-icon">⚠️</div>
            <h3>Error Loading Reviews</h3>
            <p style={{ color: '#dc2626' }}>{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="admin-empty-state">
            <div className="admin-empty-state-icon">📭</div>
            <h3>No Reviews Found</h3>
            <p>{search ? 'No reviews match your search' : 'No reviews yet'}</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div>
            {filtered.map(r => (
              <div key={r._id} className="review-card-admin">
                <div className="review-card-header">
                  <div className="review-user-info">
                    <h3>{r.userId?.name || 'Anonymous User'}</h3>
                    <div className="review-user-email">{r.userId?.email || 'No email'}</div>
                  </div>
                  <button
                    className="admin-btn admin-btn-danger"
                    onClick={() => handleDelete(r._id)}
                    disabled={deletingId === r._id}
                  >
                    {deletingId === r._id ? '⏳ Deleting...' : '🗑️ Delete'}
                  </button>
                </div>

                {r.rating && (
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#f5b50a', fontSize: '1.1rem' }}>
                      {'⭐'.repeat(r.rating)}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>
                      {r.rating}/5
                    </span>
                  </div>
                )}

                {r.reviewText && (
                  <div className="review-content">
                    {r.reviewText}
                  </div>
                )}

                <div className="review-meta">
                  {r.location && (
                    <div className="review-meta-item">
                      <span>📍</span>
                      <span>{r.location}</span>
                    </div>
                  )}
                  <div className="review-meta-item">
                    <span>📅</span>
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="review-meta-item">
                    <span>🕐</span>
                    <span>{new Date(r.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog {...confirmState} />
    </div>
  );
}
