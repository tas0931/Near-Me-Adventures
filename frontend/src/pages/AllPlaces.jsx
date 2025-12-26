import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import sample from '../data/places';

const KEY = 'all_places';

export default function AllPlaces() {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('title');
  const [sortAsc, setSortAsc] = useState(true);

  const created = useMemo(() => {
    try {
      const raw = localStorage.getItem(KEY) || '[]';
      return JSON.parse(raw);
    } catch (e) { return []; }
  }, [refresh]);

  const all = [...sample, ...created];

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const s = String(priceStr).trim();
    if (/free/i.test(s)) return 0;
    const cleaned = s.replace(/,/g, '').replace(/[^0-9.\-–]/g, ' ');
    const m = cleaned.match(/(\d+[\d\.]*)/);
    return m ? Number(m[0]) : 0;
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = all.slice();
    if (term) {
      list = list.filter(item => {
        if (searchBy === 'duration') return (item.duration || '').toLowerCase().includes(term);
        if (searchBy === 'price') {
          // If the search term is a number, show items with numeric price <= search number
          if (/^\d+(?:\.\d+)?$/.test(term)) {
            const searchNum = Number(term);
            const itemPrice = parsePrice(item.price);
            return Number.isFinite(itemPrice) && itemPrice <= searchNum;
          }
          return String(parsePrice(item.price)).toLowerCase().includes(term) || (item.price || '').toLowerCase().includes(term);
        }
        // default: title
        return (item.title || '').toLowerCase().includes(term);
      });
    }
    return list.sort((a, b) => {
      const pa = parsePrice(a.price);
      const pb = parsePrice(b.price);
      return sortAsc ? pa - pb : pb - pa;
    });
  }, [all, search, searchBy, sortAsc]);

  return (
    <div className="page">
      <div className="page-header">
        <div className="brand">
          <h2 className="brand-heading">All Places</h2>
          <p>Explore all available places and experiences</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <button onClick={() => navigate(-1)}>Back</button>
          <button style={{ marginLeft: 2 }} onClick={() => navigate('/dashboard')}>User's Dashboard</button>
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <select value={searchBy} onChange={e => setSearchBy(e.target.value)} style={{ padding: 8, borderRadius: 8 }}>
          <option value="title">Title</option>
          <option value="duration">Duration</option>
          <option value="price">Price</option>
        </select>
        <input
          placeholder={searchBy === 'price' ? 'Search by price' : searchBy === 'duration' ? 'Search by duration' : 'Search by title'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 8, width: '100%', maxWidth: 400, borderRadius: 8 }}
        />
        <button onClick={() => setSearch('')} style={{ padding: 8, borderRadius: 8 }}>Clear</button>
        <button onClick={() => setSortAsc(s => !s)} style={{ marginLeft: 8, padding: '8px 10px', borderRadius: 8 }}>
          {sortAsc ? 'Price ↑' : 'Price ↓'}
        </button>
      </div>

      <div className="grid" style={{ marginTop: 12 }}>
        {filtered.length > 0 ? (
          filtered.map(item => <Card key={item.id || item._id || item.title} {...item} />)
        ) : (
          <div className="container">
            <p>No places available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
