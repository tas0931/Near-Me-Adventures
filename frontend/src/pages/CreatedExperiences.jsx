import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationsContext';
import { useConfirm } from '../hooks/useConfirm';
import ConfirmDialog from '../components/ConfirmDialog';
import '../styles/admin.css';

export default function CreatedExperiences() {
  const navigate = useNavigate();
  const { add: notify } = useNotifications();
  const { confirmState, confirm } = useConfirm();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      const raw = localStorage.getItem('all_places') || '[]';
      const arr = JSON.parse(raw);
      setPlaces(Array.isArray(arr) ? arr : []);
    } catch (err) {
      setError(err.message || 'Failed to load places');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id, title) => {
    const confirmed = await confirm({
      title: 'Delete Experience',
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      setDeletingId(id);
      const raw = localStorage.getItem('all_places') || '[]';
      const arr = JSON.parse(raw).filter(p => p.id !== id && p._id !== id);
      localStorage.setItem('all_places', JSON.stringify(arr));
      setPlaces(arr);
      notify(`Experience "${title}" deleted successfully`, { type: 'success' });
    } catch (err) {
      notify(err.message || 'Delete failed', { type: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = places.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase().trim();
    // If the query is purely numeric, match exact numeric price only
    if (/^\d+(?:\.\d+)?$/.test(q)) {
      const searchNum = parseFloat(q);
      const raw = p.price;
      let pNum = null;
      if (typeof raw === 'number') pNum = raw;
      else if (typeof raw === 'string') {
        const m = raw.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
        if (m) pNum = parseFloat(m[0]);
      }
      return pNum !== null && Number(pNum) === Number(searchNum);
    }
    return (p.title || '').toLowerCase().includes(q) || (p.duration || '').toLowerCase().includes(q) || (p.price || '').toLowerCase().includes(q);
  });

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            <span className="admin-title-icon">📝</span>
            Created Experiences
          </h1>
          <p className="admin-subtitle">Manage experiences created via the admin form</p>
        </div>
        <div className="admin-actions">
          <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/add-experiences')}>
            ➕ Add New Experience
          </button>
          <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/admin')}>
            ← Back to Admin
          </button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{places.length}</div>
          <div className="stat-label">Total Experiences</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✨</div>
          <div className="stat-value">{filtered.length}</div>
          <div className="stat-label">Filtered Results</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">
            <span className="admin-card-icon">🔍</span>
            All Experiences
          </h2>
        </div>

        {loading && (
          <div className="admin-loading">
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
            <p>Loading experiences...</p>
          </div>
        )}

        {error && (
          <div className="admin-empty-state">
            <div className="admin-empty-state-icon">⚠️</div>
            <h3>Error Loading Experiences</h3>
            <p style={{ color: '#dc2626' }}>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="admin-search-bar">
              <input
                className="admin-search-input"
                placeholder="🔎 Search by title, price or duration..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="admin-btn admin-btn-secondary" onClick={() => setSearch('')}>
                  Clear
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="admin-empty-state">
                <div className="admin-empty-state-icon">📭</div>
                <h3>No Experiences Found</h3>
                <p>{search ? 'No experiences match your search' : 'No experiences created yet'}</p>
                <button className="admin-btn admin-btn-primary" onClick={() => navigate('/add-experiences')} style={{ marginTop: '16px' }}>
                  ➕ Create Your First Experience
                </button>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Duration</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id || p._id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{p.title}</div>
                          {p.desc && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              {p.desc.length > 60 ? `${p.desc.substring(0, 60)}...` : p.desc}
                            </div>
                          )}
                        </td>
                        <td>{p.price || 'N/A'}</td>
                        <td>{p.duration || 'N/A'}</td>
                        <td>
                          {p.rating ? (
                            <span style={{ color: '#f5b50a' }}>
                              {'⭐'.repeat(Math.round(p.rating))} {p.rating}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-secondary)' }}>No rating</span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(p.id || p._id, p.title)}
                            disabled={deletingId === (p.id || p._id)}
                            className="admin-btn admin-btn-danger"
                            style={{ padding: '8px 16px' }}
                          >
                            {deletingId === (p.id || p._id) ? '⏳ Deleting...' : '🗑️ Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog {...confirmState} />
    </div>
  );
}
