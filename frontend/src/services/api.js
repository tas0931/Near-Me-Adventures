const BASE = 'http://localhost:5001/api';

async function request(path, options = {}) {
  const headers = options.headers || {};
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = 'Bearer ' + token;
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export function register(payload) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

export function login(payload) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}

export function getProfile() {
  return request('/auth/me', { method: 'GET' });
}

export function getAllUsers() {
  return request('/auth/admin/users', { method: 'GET' });
}

export function browseUsers() {
  return request('/auth/users/browse', { method: 'GET' });
}

export function deleteUser(id) {
  return request(`/auth/admin/users/${id}`, { method: 'DELETE' });
}

// Wishlist APIs
export function getWishlist() {
  return request('/wishlist', { method: 'GET' });
}

export function addWishlist(item) {
  return request('/wishlist', { method: 'POST', body: JSON.stringify(item) });
}

export function removeWishlist(itemId) {
  return request(`/wishlist/${itemId}`, { method: 'DELETE' });
}

// Bookings APIs
export function getServerBookings() {
  return request('/bookings', { method: 'GET' });
}

export function addServerBooking(item) {
  return request('/bookings', { method: 'POST', body: JSON.stringify(item) });
}

export function removeServerBooking(itemId) {
  return request(`/bookings/${itemId}`, { method: 'DELETE' });
}

export function payBooking(itemId) {
  return request(`/bookings/${itemId}/pay`, { method: 'POST' });
}

// Admin helpers to fetch specific user's data
export function getUserBookings(userId) {
  return request(`/auth/admin/users/${userId}/bookings`, { method: 'GET' });
}

export function getUserWishlist(userId) {
  return request(`/auth/admin/users/${userId}/wishlist`, { method: 'GET' });
}

// Chat APIs
export function getChatMessages() {
  return request('/chat', { method: 'GET' });
}

export function postChatMessage(payload) {
  return request('/chat', { method: 'POST', body: JSON.stringify(payload) });
}

// Trending
export function getTrending() {
  return request('/trending', { method: 'GET' });
}

// Reviews
export function getAllReviews() {
  return request('/reviews', { method: 'GET' });
}

export function createReview(payload) {
  return request('/reviews', { method: 'POST', body: JSON.stringify(payload) });
}

export function deleteReview(id) {
  return request(`/reviews/${id}`, { method: 'DELETE' });
}

// Connection/Friend Request APIs
export function sendConnectionRequest(recipientId) {
  return request('/connections/send', { method: 'POST', body: JSON.stringify({ recipientId }) });
}

export function acceptConnectionRequest(connectionId) {
  return request(`/connections/accept/${connectionId}`, { method: 'PUT' });
}

export function rejectConnectionRequest(connectionId) {
  return request(`/connections/reject/${connectionId}`, { method: 'PUT' });
}

export function cancelConnectionRequest(connectionId) {
  return request(`/connections/cancel/${connectionId}`, { method: 'DELETE' });
}

export function getPendingRequests() {
  return request('/connections/pending', { method: 'GET' });
}

export function getSentRequests() {
  return request('/connections/sent', { method: 'GET' });
}

export function getFriends() {
  return request('/connections/friends', { method: 'GET' });
}

export function removeFriend(friendId) {
  return request(`/connections/friend/${friendId}`, { method: 'DELETE' });
}

export function getConnectionStatus(otherUserId) {
  return request(`/connections/status/${otherUserId}`, { method: 'GET' });
}

// Direct Messages APIs
export function sendDirectMessage(recipientId, text) {
  return request('/direct-messages/send', { 
    method: 'POST', 
    body: JSON.stringify({ recipientId, text }) 
  });
}

export function getConversation(otherUserId) {
  return request(`/direct-messages/conversation/${otherUserId}`, { method: 'GET' });
}

export function getConversations() {
  return request('/direct-messages/conversations', { method: 'GET' });
}

export function getUnreadCount() {
  return request('/direct-messages/unread-count', { method: 'GET' });
}

export function markAsRead(otherUserId) {
  return request(`/direct-messages/mark-read/${otherUserId}`, { method: 'PUT' });
}

export function deleteDirectMessage(messageId) {
  return request(`/direct-messages/${messageId}`, { method: 'DELETE' });
}

// Place Suggestions APIs
export function getAllPlaceSuggestions() {
  return request('/place-suggestions', { method: 'GET' });
}

export function createPlaceSuggestion(payload) {
  return request('/place-suggestions', { method: 'POST', body: JSON.stringify(payload) });
}

export function getUserPlaceSuggestions() {
  return request('/place-suggestions/my-suggestions', { method: 'GET' });
}

export function deletePlaceSuggestion(id) {
  return request(`/place-suggestions/${id}`, { method: 'DELETE' });
}