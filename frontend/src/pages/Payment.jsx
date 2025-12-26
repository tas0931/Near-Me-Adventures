import React, { useEffect, useState } from 'react';
import { getBookings as getClientBookings, saveBookings, removeBooking } from '../services/bookings';
import * as api from '../services/api';
import { useNotifications } from '../contexts/NotificationsContext';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  const { add } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const local = getClientBookings() || [];
        setBookings(local);
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const res = await api.getServerBookings();
            const list = (res.bookings || []).map(b => ({ id: b.itemId || b.id, title: b.title, img: b.img, duration: b.duration, price: b.price, priceLabel: b.priceLabel, paid: !!b.paid, paymentId: b.paymentId }));
            if (!mounted) return;
            setBookings(list);
            try { saveBookings(list); } catch (e) { /* ignore */ }
          } catch (err) {
            // ignore server errors
          }
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handlePay = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return add('Please login to make payment', { type: 'error' });
      const res = await api.payBooking(id);
      // update local state
      const updated = (res.bookings || []).map(b => ({ id: b.itemId || b.id, title: b.title, img: b.img, duration: b.duration, price: b.price, priceLabel: b.priceLabel, paid: !!b.paid, paymentId: b.paymentId }));
      setBookings(updated);
      try { saveBookings(updated); } catch (e) { /* ignore */ }
      add('Payment successful', { type: 'success' });
    } catch (err) {
      add('Payment failed', { type: 'error' });
    }
  };

  const handleMarkDone = (id) => {
    try {
      const result = removeBooking(id);
      if (result && typeof result.then === 'function') {
        result.then(updated => {
          setBookings(updated);
          try { saveBookings(updated); } catch (e) { /* ignore */ }
          add('Booking marked done', { type: 'info' });
        }).catch(() => add('Could not remove booking', { type: 'error' }));
      } else {
        setBookings(result);
        try { saveBookings(result); } catch (e) { /* ignore */ }
        add('Booking marked done', { type: 'info' });
      }
    } catch (err) {
      add('Could not remove booking', { type: 'error' });
    }
  };

  const getPriceValue = (item) => {
    if (!item) return 0;
    const v = item.price;
    if (typeof v === 'number') return v;
    if (!v) return 0;
    const parsed = parseFloat(String(v).replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const toggleBookingsSort = () => {
    const next = !sortAsc;
    const sorted = [...bookings].sort((a, b) => {
      const pa = getPriceValue(a);
      const pb = getPriceValue(b);
      return next ? pa - pb : pb - pa;
    });
    setSortAsc(next);
    setBookings(sorted);
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div className="brand"><h2 className="brand-heading">Near-me Adventures</h2></div>
        <div style={{ textAlign: 'right' }}>
          <button style={{ marginRight: 8 }} onClick={() => navigate('/dashboard')}>Back</button>
        </div>
      </div>

      <h1>Payments</h1>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={toggleBookingsSort} style={{ padding: '6px 10px' }}>{sortAsc ? 'Price ↑' : 'Price ↓'}</button>
      </div>
      {bookings.length === 0 ? (
        <div className="container"><p>No booked experiences to pay for.</p></div>
      ) : (
        <div className="grid" style={{ marginTop: 12 }}>
          {bookings.map(b => (
            <div key={b.id} className="card-item">
              <div className="card-media" style={{ backgroundImage: `url(${b.img})` }} />
              <div className="card-body">
                <div style={{ fontWeight: 700 }}>{b.title}</div>
                <div className="muted">{b.duration}</div>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="muted">{b.priceLabel ? b.priceLabel : `৳ ${b.price}`}</div>
                  <div>
                    {b.paid ? (
                      <>
                        <span style={{ color: 'green', marginRight: 8 }}>Paid</span>
                        <button onClick={() => handleMarkDone(b.id)}>Mark as done</button>
                      </>
                    ) : (
                      <button onClick={() => handlePay(b.id)}>Make Payment</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
