import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getTrending } from '../services/api';

export default function TrendingExperiences() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ topBooked: [], topWishlisted: [] });
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await getTrending();
        if (mounted) setData(res);
      } catch (err) {
        console.error('Failed to load trending:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="container"><p>Loading trending experiences...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Trending Experiences</h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => navigate('/home')}>Back to Home</button>
            <Link to="/browse"><button>Browse Experiences</button></Link>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p>Discover the most popular experiences right now!!</p>
      </div>

      <div className="trending-sections">
        <div className="trending-column">
          <h3>Top 3 Most Booked</h3>
          {data.topBooked.length === 0 && <div className="muted">No bookings yet</div>}
          {data.topBooked.map((it) => (
            <div
              key={it.itemId}
              className="card small-card"
              style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #e6e6e6', padding: 8, borderRadius: 8 }}
            >
              {it.img ? (
                <img
                  src={it.img}
                  alt={it.title}
                  style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 6 }}
                />
              ) : (
                <div style={{ width: 96, height: 64, background: '#eee', borderRadius: 6 }} />
              )}
              <div style={{ flex: 1 }}>
                <div className="card-title">{it.title}</div>
              </div>
              <div style={{ fontWeight: 600 }} className="muted">{it.count} times</div>
            </div>
          ))}
        </div>

        <div className="trending-column">
          <h3>Top 3 Most Wishlisted</h3>
          {data.topWishlisted.length === 0 && <div className="muted">No wishlists yet</div>}
          {data.topWishlisted.map((it) => (
            <div
              key={it.itemId}
              className="card small-card"
              style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #e6e6e6', padding: 8, borderRadius: 8 }}
            >
              {it.img ? (
                <img
                  src={it.img}
                  alt={it.title}
                  style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 6 }}
                />
              ) : (
                <div style={{ width: 96, height: 64, background: '#eee', borderRadius: 6 }} />
              )}
              <div style={{ flex: 1 }}>
                <div className="card-title">{it.title}</div>
              </div>
              <div style={{ fontWeight: 600 }} className="muted">{it.count} users</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
