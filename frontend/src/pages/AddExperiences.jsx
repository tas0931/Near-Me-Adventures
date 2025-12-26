import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationsContext';
import '../styles/admin.css';

export default function AddExperiences() {
  const navigate = useNavigate();
  const { add: notify } = useNotifications();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !desc) {
      notify('Please fill in title and description', { type: 'error' });
      return;
    }
    const place = { id: Date.now(), title, desc, duration, price, img, rating: Number(rating) || 0 };
    try {
      const raw = localStorage.getItem('all_places') || '[]';
      const arr = JSON.parse(raw);
      arr.push(place);
      localStorage.setItem('all_places', JSON.stringify(arr));
      notify(`Experience "${title}" created successfully`, { type: 'success' });
      setTitle(''); setDesc(''); setDuration(''); setPrice(''); setImg(''); setRating(0);
    } catch (e) {
      notify('Failed to create experience', { type: 'error' });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            <span className="admin-title-icon">➕</span>
            Add New Experience
          </h1>
          <p className="admin-subtitle">Create exciting adventures for your users</p>
        </div>
        <div className="admin-actions">
          <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/created-experiences')}>
            📝 View All Experiences
          </button>
          <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/admin')}>
            ← Back to Admin
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">
            <span className="admin-card-icon">📋</span>
            Experience Details
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Title <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Sunset Beach Kayaking"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-gray)',
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Description <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Describe the experience in detail..."
                required
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-gray)',
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Duration
                </label>
                <input
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder="e.g., 2 hours"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-gray)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Price
                </label>
                <input
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="e.g., $50"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-gray)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Rating (0-5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={rating}
                onChange={e => setRating(e.target.value)}
                placeholder="4.5"
                style={{
                  width: '200px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-gray)',
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Image URL
              </label>
              <input
                value={img}
                onChange={e => setImg(e.target.value)}
                placeholder="https://example.com/image.jpg"
                type="url"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-gray)',
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem'
                }}
              />
              {img && (
                <div style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-gray)' }}>
                  <img src={img} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', paddingTop: '24px', borderTop: '1px solid var(--border-gray)' }}>
            <button type="submit" className="admin-btn admin-btn-success">
              ✨ Create Experience
            </button>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={() => navigate('/created-experiences')}>
              📝 View All Experiences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
