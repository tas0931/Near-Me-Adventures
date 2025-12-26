// Client-side bookings service with server fallback
const KEY = 'nearme_bookings';
import { getServerBookings, addServerBooking, removeServerBooking } from './api';

function isAuthenticated() {
  return !!localStorage.getItem('token');
}

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  const s = String(priceStr).trim();
  if (/free/i.test(s)) return 0;
  // extract first number sequence (handles ranges like "৳ 800 – 1,200")
  const m = s.replace(/,/g, '').match(/(\d+)/);
  return m ? Number(m[0]) : 0;
}

export function getBookings() {
  // If authenticated, try server first
  if (isAuthenticated()) {
    try {
      // this returns a promise in async contexts; keep sync fallback
      // consumers usually call getBookings synchronously, so use local cache
      const raw = localStorage.getItem(KEY) || '[]';
      return JSON.parse(raw);
    } catch (err) {
      return [];
    }
  }
  try {
    const raw = localStorage.getItem(KEY) || '[]';
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveBookings(list) {
  localStorage.setItem(KEY, JSON.stringify(list || []));
}

export function addBooking(item) {
  if (!item) return;
  // if authenticated, use server API
  if (isAuthenticated()) {
    try {
      const price = parsePrice(item.price);
      const payload = { itemId: String(item.id), title: item.title, img: item.img, duration: item.duration, price: price, priceLabel: item.price };
      return addServerBooking(payload).then(res => {
        // keep local cache in sync
        saveBookings(res.bookings || []);
        return res.bookings || [];
      }).catch(() => {
        // fallback to local
        const bookings = getBookings();
        const exists = bookings.find(b => b.id === item.id);
        if (exists) return bookings;
        const price = parsePrice(item.price);
        const record = { id: item.id, title: item.title, price, priceLabel: item.price, img: item.img, duration: item.duration };
        bookings.push(record);
        saveBookings(bookings);
        return bookings;
      });
    } catch (err) {
      // fallback to local
    }
  }
  if (!item) return;
  const bookings = getBookings();
  // avoid duplicate booking with same id
  const exists = bookings.find(b => b.id === item.id);
  if (exists) return bookings;
  const price = parsePrice(item.price);
  const record = {
    id: item.id,
    title: item.title,
    price,
    priceLabel: item.price,
    img: item.img,
    duration: item.duration
  };
  bookings.push(record);
  saveBookings(bookings);
  return bookings;
}

export function removeBooking(id) {
  if (isAuthenticated()) {
    return removeServerBooking(String(id)).then(res => {
      saveBookings(res.bookings || []);
      return res.bookings || [];
    }).catch(() => {
      const bookings = getBookings().filter(b => b.id !== id);
      saveBookings(bookings);
      return bookings;
    });
  }
  const bookings = getBookings().filter(b => b.id !== id);
  saveBookings(bookings);
  return bookings;
}

export function clearBookings() {
  saveBookings([]);
}

export function getTotal() {
  return getBookings().reduce((s, b) => s + (b.price || 0), 0);
}

export default { getBookings, addBooking, removeBooking, clearBookings, getTotal };
