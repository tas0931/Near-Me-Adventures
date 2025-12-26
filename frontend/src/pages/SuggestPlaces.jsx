import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlaceSuggestion, getAllPlaceSuggestions, deletePlaceSuggestion, getProfile } from '../services/api';
import { useNotifications } from '../contexts/NotificationsContext';
import { useConfirm } from '../hooks/useConfirm';
import ConfirmDialog from '../components/ConfirmDialog';
import '../styles/admin.css';

const CATEGORIES = [
  { value: 'adventure', label: 'Adventure' },
  { value: 'beach', label: 'Beach' },
  { value: 'mountain', label: 'Mountain' },
  { value: 'historical', label: 'Historical' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'nature', label: 'Nature' },
  { value: 'urban', label: 'Urban' },
  { value: 'religious', label: 'Religious' },
  { value: 'food and dining', label: 'Food and Dining' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'others', label: 'Others' }
];

export default function SuggestPlaces() {
  const navigate = useNavigate();
  const { add: notify } = useNotifications();
  const { confirmState, confirm } = useConfirm();

  const [user, setUser] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [city, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadUserAndSuggestions() {
      try {
        const [profileRes, suggestionsRes] = await Promise.all([
          getProfile(),
          getAllPlaceSuggestions()
        ]);
        setUser(profileRes.user);
        setSuggestions(suggestionsRes.suggestions || []);
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    loadUserAndSuggestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!placeName || !city || !country || !category || !description) {
      notify('Please fill in all required fields', { type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        placeName: placeName.trim(),
        city: city.trim(),
        stateProvince: stateProvince.trim() || undefined,
        country: country.trim(),
        category,
        description: description.trim()
      };

      const res = await createPlaceSuggestion(payload);
      notify('Place suggestion submitted successfully!', { type: 'success' });

      // Add the new suggestion to the list
      setSuggestions([res.suggestion, ...suggestions]);

      // Reset form
      setPlaceName('');
      setCity('');
      setStateProvince('');
      setCountry('');
      setCategory('');
      setDescription('');
    } catch (err) {
      notify(err.message || 'Failed to submit suggestion', { type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, placeName) => {
    const confirmed = await confirm({
      title: 'Delete Suggestion',
      message: `Are you sure you want to delete the suggestion for "${placeName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deletePlaceSuggestion(id);
      setSuggestions(suggestions.filter(s => s._id !== id));
      notify('Suggestion deleted successfully', { type: 'success' });
    } catch (err) {
      notify(err.message || 'Delete failed', { type: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            <span className="admin-title-icon">💡</span>
            Suggest a Place
          </h1>
          <p className="admin-subtitle">Help us grow our collection of amazing destinations</p>
        </div>
        <div className="admin-actions">
          <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/browse')}>
            🌍 Browse Places
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">
            <span className="admin-card-icon">📋</span>
            Place Details
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Place Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                value={placeName}
                onChange={e => setPlaceName(e.target.value)}
                placeholder="e.g., Cox's Bazar Beach"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  City <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g., Cox's Bazar"
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
                  State/Province
                </label>
                <input
                  value={stateProvince}
                  onChange={e => setStateProvince(e.target.value)}
                  placeholder="e.g., Chittagong"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Country <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="e.g., Bangladesh"
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
                  Category <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-gray)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Description <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Tell us about this place and why you think it should be included..."
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

            <div style={{ borderTop: '1px solid var(--border-gray)', paddingTop: '20px' }}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '12px' }}>
                Your Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Name
                  </label>
                  <input
                    value={user?.name || ''}
                    disabled
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-gray)',
                      background: 'var(--hover-gray)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.95rem',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Email
                  </label>
                  <input
                    value={user?.email || ''}
                    disabled
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-gray)',
                      background: 'var(--hover-gray)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.95rem',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-gray)' }}>
            <button
              type="submit"
              disabled={submitting}
              className="admin-btn admin-btn-success"
            >
              {submitting ? '⏳ Submitting...' : '✨ Submit Suggestion'}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">
            <span className="admin-card-icon">📍</span>
            All Suggestions ({suggestions.length})
          </h2>
        </div>

        {loading && (
          <div className="admin-loading">
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
            <p>Loading suggestions...</p>
          </div>
        )}

        {error && (
          <div className="admin-empty-state">
            <div className="admin-empty-state-icon">⚠️</div>
            <h3>Error Loading Suggestions</h3>
            <p style={{ color: '#dc2626' }}>{error}</p>
          </div>
        )}

        {!loading && !error && suggestions.length === 0 && (
          <div className="admin-empty-state">
            <div className="admin-empty-state-icon">📭</div>
            <h3>No Suggestions Yet</h3>
            <p>Be the first to suggest an amazing place!</p>
          </div>
        )}

        {!loading && !error && suggestions.length > 0 && (
          <div style={{ display: 'grid', gap: '16px' }}>
            {suggestions.map(s => (
              <div
                key={s._id}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-gray)',
                  borderRadius: '10px',
                  padding: '20px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 600, margin: '0 0 4px 0' }}>
                      {s.placeName}
                    </h3>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      📍 {s.city}{s.stateProvince ? `, ${s.stateProvince}` : ''}, {s.country}
                    </div>
                  </div>
                  {(user?._id === s.userId?._id || localStorage.getItem('isAdmin') === 'true') && (
                    <button
                      onClick={() => handleDelete(s._id, s.placeName)}
                      disabled={deletingId === s._id}
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '8px 16px' }}
                    >
                      {deletingId === s._id ? '⏳ Deleting...' : '🗑️ Delete'}
                    </button>
                  )}
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: 'var(--hover-gray)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {CATEGORIES.find(c => c.value === s.category)?.label || s.category}
                  </span>
                </div>

                <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, margin: '12px 0' }}>
                  {s.description}
                </p>

                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-gray)' }}>
                  <div>
                    <span>👤</span> {s.userName}
                  </div>
                  <div>
                    <span>📧</span> {s.userEmail}
                  </div>
                  <div>
                    <span>📅</span> {new Date(s.createdAt).toLocaleDateString()}
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
