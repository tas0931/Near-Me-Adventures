import React, { useState, useEffect } from 'react';
import { addBooking, getBookings } from '../services/bookings';
import ConfirmModal from './ConfirmModal';
import { useNotifications } from '../contexts/NotificationsContext';
import { getWishlist, addWishlist, removeWishlist } from '../services/api';

export default function Card({ id, img, title, desc, duration, price, rating }) {
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  // when clicking book, add to local bookings and mark added
  const onBook = () => {
    // open confirmation modal
    setShowConfirm(true);
  };

  // disable if already booked
  React.useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem('token');
    async function check() {
      try {
        if (token) {
          const { getServerBookings } = await import('../services/api');
          const res = await getServerBookings();
          if (!mounted) return;
          const list = res.bookings || [];
          const exists = list.find(b => (b.itemId === String(id) || b.itemId === String(title) || b.id === id));
          if (exists) setAdded(true);
          return;
        }
      } catch (err) {
        // ignore and fallback to local
      }
      const existsLocal = getBookings().find(b => b.title === title || b.id === id || b.itemId === String(id));
      if (existsLocal && mounted) setAdded(true);
    }
    check();
    return () => { mounted = false; };
  }, [title, id]);

  // check wishlist status
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await getWishlist();
        if (!mounted) return;
        const list = res.wishlist || [];
        const exists = list.find(i => i.itemId === String(id) || i.title === title);
        if (exists) setWishlisted(true);
      } catch (err) {
        // ignore
      }
    }
    load();
    return () => { mounted = false; };
  }, [title]);

  const { add } = useNotifications();
  const [showConfirm, setShowConfirm] = useState(false);

  const confirmBooking = () => {
    const payload = { id: id || (title + '|' + img), title, price, img, duration };
    try {
      const result = addBooking({ id: payload.id, title: payload.title, price: payload.priceLabel || payload.price, img: payload.img, duration: payload.duration });
      if (result && typeof result.then === 'function') {
        result.then(() => setAdded(true)).catch(() => add('Could not complete booking', { type: 'error' }));
      } else {
        setAdded(true);
      }
      add(`Booked: ${title}`, { type: 'success', timeout: 3500 });
    } catch (err) {
      add('Could not complete booking', { type: 'error' });
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="card-item">
      <div className="card-media" style={{ backgroundImage: `url(${img})` }} />
      <div className="card-body">
        <div className="card-title">{title}</div>
        <div className="card-desc muted">{desc}</div>
        <div style={{ marginTop: 'auto' }}>
          <div className="card-row">
            <div className="muted card-meta">{duration}</div>
            <div className="muted card-meta">{price}</div>
          </div>
          <div className="card-row" style={{ marginTop: 8 }}>
            <div className="muted">⭐ {rating}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="book-button" onClick={onBook} disabled={added}>{added ? 'Booked' : 'Book Now'}</button>
              <button
                className="book-button wishlist-button"
                onClick={async () => {
                  try {
                    if (!wishlisted) {
                      await addWishlist({ itemId: String(id), title, img, duration, price });
                      setWishlisted(true);
                      add(`Saved to wishlist: ${title}`, { type: 'success' });
                    } else {
                      await removeWishlist(String(id));
                      setWishlisted(false);
                      add(`Removed from wishlist: ${title}`, { type: 'info' });
                    }
                  } catch (err) {
                    add('Could not update wishlist', { type: 'error' });
                  }
                }}
              >{wishlisted ? 'Saved' : 'Save'}</button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        open={showConfirm}
        title={`Confirm booking`}
        message={`Do you want to book "${title}" for ${price}?`}
        onConfirm={confirmBooking}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
