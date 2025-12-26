import React, { useState, useEffect } from 'react';
import {
  getPendingRequests,
  acceptConnectionRequest,
  rejectConnectionRequest
} from '../services/api';
import { useNotifications } from '../contexts/NotificationsContext';

export default function PendingRequests() {
  const { add: notify } = useNotifications();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      const data = await getPendingRequests();
      setRequests(data.pendingRequests || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (connectionId) => {
    try {
      await acceptConnectionRequest(connectionId);
      setRequests(requests.filter(r => r._id !== connectionId));
      notify('Connection request accepted', { type: 'success' });
    } catch (err) {
      notify(err.message || 'Failed to accept request', { type: 'error' });
    }
  };

  const handleReject = async (connectionId) => {
    try {
      await rejectConnectionRequest(connectionId);
      setRequests(requests.filter(r => r._id !== connectionId));
      notify('Connection request rejected', { type: 'info' });
    } catch (err) {
      notify(err.message || 'Failed to reject request', { type: 'error' });
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="pending-requests">
      <h2>Pending Connection Requests ({requests.length})</h2>
      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <div className="requests-list">
          {requests.map(request => (
            <div key={request._id} className="request-card">
              <div className="user-info">
                <h3>{request.requester.name}</h3>
                <p>{request.requester.email}</p>
                <small>Sent: {new Date(request.createdAt).toLocaleDateString()}</small>
              </div>
              <div className="actions">
                <button
                  className="btn-accept"
                  onClick={() => handleAccept(request._id)}
                >
                  Accept
                </button>
                <button
                  className="btn-reject"
                  onClick={() => handleReject(request._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
