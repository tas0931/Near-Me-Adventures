import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import sample from '../data/places';

export default function Browse() {
  const navigate = useNavigate();
  const [sortAsc, setSortAsc] = useState(true);

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const s = String(priceStr).trim();
    if (/free/i.test(s)) return 0;
    // remove commas and non-numeric/dot/–- characters, handle ranges by taking first number
    const cleaned = s.replace(/,/g, '').replace(/[^0-9.\-–]/g, ' ');
    const m = cleaned.match(/(\d+[\d\.]*)/);
    return m ? Number(m[0]) : 0;
  };

  const displayed = useMemo(() => {
    const list = sample.slice();
    return list.sort((a, b) => {
      const pa = parsePrice(a.price);
      const pb = parsePrice(b.price);
      return sortAsc ? pa - pb : pb - pa;
    });
  }, [sortAsc]);

  return (
    <div className="page">
      <div className="page-header">
        <div className="brand">
          <h2 className="brand-heading">Browse Experiences</h2>
          <h4 style={{ color: 'var(--light-gray)', fontWeight: 400 }}>Discover unique activities around you (Premium and best ones)</h4>
        </div>
      </div>

      <div className="search-row">
        <button onClick={() => setSortAsc(s => !s)} style={{ padding: '8px 10px', borderRadius: 8 }}>
          {sortAsc ? 'Price ↑' : 'Price ↓'}
        </button>
      </div>

      <div className="grid">
        {displayed.length > 0 ? (
          displayed.map(item => (
            <Card key={item.id} {...item} />
          ))
        ) : (
          <div className="container">
            <p>No experiences found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
