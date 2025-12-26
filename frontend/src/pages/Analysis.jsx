import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../services/api';
import '../styles/admin.css';

export default function Analysis() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllUsers();
        if (!mounted) return;
        setUsers(res.users || []);
      } catch (err) {
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    if (searchBy === 'email') return (u.email || '').toLowerCase().includes(q);
    return (u.name || '').toLowerCase().includes(q);
  });

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            <span className="admin-title-icon">📊</span>
            User Analytics
          </h1>
          <p className="admin-subtitle">View detailed analytics for all users</p>
        </div>
        <div className="admin-actions">
          <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/admin')}>
            ← Back to Admin
          </button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-value">{filtered.length}</div>
          <div className="stat-label">Filtered Results</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">
            <span className="admin-card-icon">👤</span>
            User List
          </h2>
        </div>

        {loading && (
          <div className="admin-loading">
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
            <p>Loading users...</p>
          </div>
        )}

        {error && (
          <div className="admin-empty-state">
            <div className="admin-empty-state-icon">⚠️</div>
            <h3>Error Loading Users</h3>
            <p style={{ color: '#dc2626' }}>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="admin-search-bar">
              <select
                className="admin-filter-select"
                value={searchBy}
                onChange={e => setSearchBy(e.target.value)}
              >
                <option value="name">Search by Name</option>
                <option value="email">Search by Email</option>
              </select>
              <input
                className="admin-search-input"
                placeholder={searchBy === 'email' ? '🔎 Search by email...' : '🔎 Search by name...'}
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
                <h3>No Users Found</h3>
                <p>{search ? 'No users match your search' : 'No users yet'}</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {filtered.map(u => (
                  <div
                    key={u._id}
                    onClick={() => navigate(`/analysis/${u._id}`)}
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-gray)',
                      borderRadius: '10px',
                      padding: '16px 20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
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
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {u.email}
                      </div>
                    </div>
                    <div style={{ fontSize: '1.5rem' }}>→</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
