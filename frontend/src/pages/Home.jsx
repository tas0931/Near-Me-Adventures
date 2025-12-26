import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile } from '../services/api';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await getProfile();
        setUser(res.user);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [navigate]);

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="page">
      <div className="brand">
        <h2 className="brand-heading">Welcome to Near-me Adventures</h2>
        <p style={{ color: 'var(--light-gray)', marginTop: '8px' }}>
          Your gateway to unforgettable local experiences, {user?.name}!
        </p>
      </div>

      <div style={{ marginTop: '48px' }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '24px', fontSize: '1.3rem' }}>Explore Your Next Adventure</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <Link to="/all-places" style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                padding: '32px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
              }}
            >
              <div style={{ fontSize: '4rem' }}>🌍</div>
              <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Browse Experiences</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem', margin: 0 }}>Discover amazing local adventures</p>
            </div>
          </Link>

          <Link to="/trending" style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '16px',
                padding: '32px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(245, 87, 108, 0.3)',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(245, 87, 108, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(245, 87, 108, 0.3)';
              }}
            >
              <div style={{ fontSize: '4rem' }}>🔥</div>
              <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Trending Experiences</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem', margin: 0 }}>Check out what's hot right now</p>
            </div>
          </Link>

          <Link to="/recommendation" style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '16px',
                padding: '32px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(79, 172, 254, 0.3)',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(79, 172, 254, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(79, 172, 254, 0.3)';
              }}
            >
              <div style={{ fontSize: '4rem' }}>✨</div>
              <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Get Recommendations</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem', margin: 0 }}>Personalized based on your preferences</p>
            </div>
          </Link>

          <Link to="/reviews" style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                borderRadius: '16px',
                padding: '32px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(250, 112, 154, 0.3)',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(250, 112, 154, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(250, 112, 154, 0.3)';
              }}
            >
              <div style={{ fontSize: '4rem' }}>⭐</div>
              <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>View Reviews</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem', margin: 0 }}>See what others are saying</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}