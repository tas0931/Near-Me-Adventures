import React, { useEffect, useState } from 'react';
import { getProfile } from '../services/api';
import { getBookings, removeBooking, getTotal, addBooking } from '../services/bookings';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { useNotifications } from '../contexts/NotificationsContext';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [bookingsSortAsc, setBookingsSortAsc] = useState(true);
  const [pendingRemove, setPendingRemove] = useState(null);
  const [pendingBook, setPendingBook] = useState(null);
  const navigate = useNavigate();
  const { add } = useNotifications();

  useEffect(() => {
    async function load() {
      try {
        const res = await getProfile();
        setUser(res.user);
      } catch (err) {
        // token invalid or other error -> redirect to login
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }
    load();
    // load bookings from client storage
    setBookings(getBookings());
  }, [navigate]);

  // load server bookings when authenticated
  useEffect(() => {
    let mounted = true;
    async function loadServerBookings() {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const { getServerBookings } = await import('../services/api');
        const { saveBookings } = await import('../services/bookings');
        const res = await getServerBookings();
        if (!mounted) return;
        // normalize server objects to use id field for consistency
        const list = (res.bookings || []).map(b => ({ id: b.itemId || b.id, title: b.title, img: b.img, duration: b.duration, price: b.price, priceLabel: b.priceLabel, paid: !!b.paid, paymentId: b.paymentId }));
        // persist server bookings to client storage so totals remain across visits
        try { saveBookings(list); } catch (e) { /* ignore */ }
        setBookings(list);
      } catch (err) {
        // ignore
      }
    }
    loadServerBookings();
    return () => { mounted = false; };
  }, []);

  // load wishlist for dashboard
  useEffect(() => {
    let mounted = true;
    async function loadWishlist() {
      try {
        const { getWishlist } = await import('../services/api');
        const res = await getWishlist();
        if (!mounted) return;
        setWishlist(res.wishlist || []);
      } catch (err) {
        // ignore
      }
    }
    loadWishlist();
    return () => { mounted = false; };
  }, []);

  const getPriceValue = (item) => {
    if (!item) return 0;
    const v = item.price;
    if (typeof v === 'number') return v;
    if (!v) return 0;
    const parsed = parseFloat(String(v).replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const toggleSort = () => {
    const next = !sortAsc;
    const sorted = [...wishlist].sort((a, b) => {
      const pa = getPriceValue(a);
      const pb = getPriceValue(b);
      return next ? pa - pb : pb - pa;
    });
    setSortAsc(next);
    setWishlist(sorted);
  };

  const toggleBookingsSort = () => {
    const next = !bookingsSortAsc;
    const sorted = [...bookings].sort((a, b) => {
      const pa = getPriceValue(a);
      const pb = getPriceValue(b);
      return next ? pa - pb : pb - pa;
    });
    setBookingsSortAsc(next);
    setBookings(sorted);
  };

  const handleRemoveWishlist = async (itemId) => {
    try {
      const { removeWishlist } = await import('../services/api');
      const res = await removeWishlist(itemId);
      setWishlist(res.wishlist || []);
      add('Removed from wishlist', { type: 'info' });
    } catch (err) {
      add('Could not remove from wishlist', { type: 'error' });
    }
  };

  const openWishlistBooking = (item) => {
    setPendingBook(item);
  };

  const confirmBook = () => {
    if (!pendingBook) return;
    try {
      const payload = { id: pendingBook.itemId || pendingBook.id || (pendingBook.title + '|' + pendingBook.img), title: pendingBook.title, price: pendingBook.price, img: pendingBook.img, duration: pendingBook.duration };
      const result = addBooking({ id: payload.id, title: payload.title, price: payload.price, img: payload.img, duration: payload.duration });
      if (result && typeof result.then === 'function') {
        result.then(updated => setBookings(updated)).catch(() => add('Could not complete booking', { type: 'error' }));
      } else {
        setBookings(result);
      }
      add(`Booked: ${pendingBook.title}`, { type: 'success', timeout: 3500 });
    } catch (err) {
      add('Could not complete booking', { type: 'error' });
    } finally {
      setPendingBook(null);
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  const handleRemove = (id) => {
    // open confirmation modal with the selected booking
    const item = bookings.find(b => (b.id === id || b.itemId === id)) || { id };
    setPendingRemove(item);
  };

  const confirmRemove = () => {
    if (!pendingRemove) return;
    const result = removeBooking(pendingRemove.id || pendingRemove.itemId);
    if (result && typeof result.then === 'function') {
      result.then(updated => setBookings(updated)).catch(() => {
        // ignore
      });
    } else {
      setBookings(result);
    }
    add(`Removed booking: ${pendingRemove.title}`, { type: 'info' });
    setPendingRemove(null);
  };

  const cancelRemove = () => setPendingRemove(null);

  return (
    <div className="page">
      <div className="page-header">
        <div className="brand">
          <h2 className="brand-heading">Near-me Adventures</h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <button style={{ marginRight: 8 }} onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>

      <h1>Your Profile</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="form-group">
          <label>Name</label>
          <div>{user?.name}</div>
        </div>
        <div className="form-group">
          <label>Email</label>
          <div>{user?.email}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
        <h2 style={{ margin: 0 }}>Your Bookings</h2>
        <div>
          <button onClick={toggleBookingsSort} style={{ padding: '6px 10px', marginRight: 8 }}>{bookingsSortAsc ? 'Price ↑' : 'Price ↓'}</button>
          <button onClick={() => navigate('/payment')} style={{ padding: '6px 10px' }}>Payment</button>
        </div>
      </div>
      {bookings.length === 0 ? (
        <div className="container"><p>No bookings yet. Browse experiences to add.</p></div>
      ) : (
        <div className="grid" style={{ marginTop: 12 }}>
          {bookings.map(b => (
            <div key={b.id} className="card-item">
              <div className="card-media" style={{ backgroundImage: `url(${b.img})` }} />
              <div className="card-body">
                <div style={{ fontWeight: 700 }}>{b.title}</div>
                <div className="muted">{b.duration}</div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="muted">{b.priceLabel ? b.priceLabel : `৳ ${b.price}`}</div>
                    <div>
                      {b.paid ? <span style={{ color: 'green', marginRight: 8 }}>Paid</span> : null}
                      <button onClick={() => handleRemove(b.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <h3>Total: <span style={{ color: 'var(--brand-green)' }}>৳ {getTotal()}</span></h3>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
        <h2 style={{ margin: 0 }}>Your Wishlist</h2>
        <div>
          <button onClick={toggleSort} style={{ padding: '6px 10px' }}>{sortAsc ? 'Price ↑' : 'Price ↓'}</button>
        </div>
      </div>
      {wishlist.length === 0 ? (
        <div className="container"><p>No saved experiences.</p></div>
      ) : (
        <div className="grid" style={{ marginTop: 12 }}>
          {wishlist.map(w => (
            <div key={w.itemId} className="card-item">
              <div className="card-media" style={{ backgroundImage: `url(${w.img})` }} />
              <div className="card-body">
                <div style={{ fontWeight: 700 }}>{w.title}</div>
                <div className="muted">{w.duration}</div>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="muted">{w.price}</div>
                  <div>
                    <button onClick={() => handleRemoveWishlist(w.itemId)} style={{ marginRight: 8 }}>Remove</button>
                    <button onClick={() => openWishlistBooking(w)} disabled={!!bookings.find(b => (b.id === w.itemId || b.itemId === w.itemId || b.title === w.title))}>Book Now</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal
        open={!!pendingBook}
        title={pendingBook ? `Confirm booking` : 'Confirm booking'}
        message={pendingBook ? `Do you want to book "${pendingBook.title}" for ${pendingBook.price || ''}?` : ''}
        onConfirm={confirmBook}
        onCancel={() => setPendingBook(null)}
      />
      <ConfirmModal
        open={!!pendingRemove}
        title="Confirm removal"
        message={pendingRemove ? `Remove \"${pendingRemove.title}\" from your bookings?` : ''}
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
      />
    </div>
  );
}