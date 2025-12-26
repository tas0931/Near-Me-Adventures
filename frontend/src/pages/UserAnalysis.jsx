import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserBookings, getUserWishlist } from '../services/api';
import '../styles/admin.css';

export default function UserAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [bRes, wRes] = await Promise.all([getUserBookings(id), getUserWishlist(id)]);
        if (!mounted) return;
        setBookings(bRes.bookings || []);
        setWishlist(wRes.wishlist || []);
      } catch (err) {
        setError(err.message || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            <span className="admin-title-icon">📈</span>
            Individual User Analytics
          </h1>
          <p className="admin-subtitle">View bookings and wishlist for this user</p>
        </div>
        <div className="admin-actions">
          <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/analysis')}>
            ← Back to Analytics
          </button>
          <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/admin')}>
            🏠 Admin Dashboard
          </button>
        </div>
      </div>

      {loading && (
        <div className="admin-card">
          <div className="admin-loading">
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
            <p>Loading user data...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="admin-card">
          <div className="admin-empty-state">
            <div className="admin-empty-state-icon">⚠️</div>
            <h3>Error Loading User Data</h3>
            <p style={{ color: '#dc2626' }}>{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-value">{bookings.length}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-value">{wishlist.length}</div>
              <div className="stat-label">Wishlist Items</div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <span className="admin-card-icon">📅</span>
                Bookings ({bookings.length})
              </h2>
            </div>

            {bookings.length === 0 ? (
              <div className="admin-empty-state">
                <div className="admin-empty-state-icon">📭</div>
                <h3>No Bookings</h3>
                <p>This user hasn't made any bookings yet</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {bookings.map(b => (
                  <div
                    key={b.itemId || b.id}
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-gray)',
                      borderRadius: '10px',
                      padding: '16px 20px',
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
                    <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                      {b.title}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {b.duration && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>⏱️</span>
                          <span>{b.duration}</span>
                        </div>
                      )}
                      {(b.priceLabel || b.price) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>💰</span>
                          <span>{b.priceLabel ? b.priceLabel : `৳ ${b.price}`}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <span className="admin-card-icon">❤️</span>
                Wishlist ({wishlist.length})
              </h2>
            </div>

            {wishlist.length === 0 ? (
              <div className="admin-empty-state">
                <div className="admin-empty-state-icon">📭</div>
                <h3>No Wishlist Items</h3>
                <p>This user hasn't added anything to their wishlist yet</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {wishlist.map(w => (
                  <div
                    key={w.itemId}
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-gray)',
                      borderRadius: '10px',
                      padding: '16px 20px',
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
                    <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                      {w.title}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {w.duration && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>⏱️</span>
                          <span>{w.duration}</span>
                        </div>
                      )}
                      {w.price && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>💰</span>
                          <span>{w.price}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
