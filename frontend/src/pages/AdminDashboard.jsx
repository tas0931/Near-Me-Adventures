import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../services/api';
import { useNotifications } from '../contexts/NotificationsContext';
import { useConfirm } from '../hooks/useConfirm';
import ConfirmDialog from '../components/ConfirmDialog';
import '../styles/admin.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { add: notify } = useNotifications();
  const { confirmState, confirm } = useConfirm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [deletingId, setDeletingId] = useState(null);

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            <span className="admin-title-icon">⚙️</span>
            Admin Dashboard
          </h1>
          <p className="admin-subtitle">Near-me Adventures Control Panel</p>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-label">Quick Actions</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="admin-card" style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate('/analysis')} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <span style={{ fontSize: '2rem' }}>📈</span>
            Analytics
          </h3>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>View user analytics and insights</p>
        </div>

        <div className="admin-card" style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate('/add-experiences')} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <span style={{ fontSize: '2rem' }}>🎯</span>
            Experiences
          </h3>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Add, view, and manage experiences</p>
        </div>

        <div className="admin-card" style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate('/admin/reviews')} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <span style={{ fontSize: '2rem' }}>💬</span>
            Reviews
          </h3>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Manage and moderate user reviews</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">
            <span className="admin-card-icon">👥</span>
            User Management
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
              <input
                className="admin-search-input"
                placeholder={searchBy === 'email' ? '🔎 Search by email...' : '🔎 Search by name...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                className="admin-filter-select"
                value={searchBy}
                onChange={e => setSearchBy(e.target.value)}
              >
                <option value="name">Search by Name</option>
                <option value="email">Search by Email</option>
              </select>
              {search && (
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setSearch('')}
                >
                  Clear
                </button>
              )}
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(u => {
                      if (!search) return true;
                      const q = search.toLowerCase();
                      if (searchBy === 'email') return (u.email || '').toLowerCase().includes(q);
                      return (u.name || '').toLowerCase().includes(q);
                    })
                    .map(u => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                      <button
                        onClick={async () => {
                          const confirmed = await confirm({
                            title: 'Delete User',
                            message: `Are you sure you want to delete ${u.name} (${u.email})? This action cannot be undone.`,
                            confirmText: 'Delete',
                            type: 'danger'
                          });

                          if (!confirmed) return;

                          try {
                            setDeletingId(u._id);
                            await deleteUser(u._id);
                            setUsers(prev => prev.filter(x => x._id !== u._id));
                            notify(`User "${u.name}" deleted successfully`, { type: 'success' });
                          } catch (err) {
                            notify(err.message || 'Delete failed', { type: 'error' });
                          } finally {
                            setDeletingId(null);
                          }
                        }}
                        disabled={deletingId === u._id}
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '8px 16px' }}
                      >
                        {deletingId === u._id ? '⏳ Deleting...' : '🗑️ Delete'}
                      </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog {...confirmState} />
    </div>
  );
}
