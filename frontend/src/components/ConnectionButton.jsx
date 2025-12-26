import React, { useState, useEffect } from 'react';
import {
  getConnectionStatus,
  sendConnectionRequest,
  cancelConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest
} from '../services/api';
import { useNotifications } from '../contexts/NotificationsContext';

export default function ConnectionButton({ otherUserId, otherUserName }) {
  const { add: notify } = useNotifications();
  const [status, setStatus] = useState(null);
  const [connectionId, setConnectionId] = useState(null);
  const [isRequester, setIsRequester] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConnectionStatus();
  }, [otherUserId]);

  const loadConnectionStatus = async () => {
    try {
      setLoading(true);
      const data = await getConnectionStatus(otherUserId);
      setStatus(data.status);
      setConnectionId(data.connectionId);
      setIsRequester(data.isRequester);
    } catch (err) {
      console.error('Failed to load connection status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    try {
      const result = await sendConnectionRequest(otherUserId);
      setStatus('pending');
      setConnectionId(result.connection._id);
      setIsRequester(true);
      notify('Connection request sent', { type: 'success' });
    } catch (err) {
      notify(err.message || 'Failed to send request', { type: 'error' });
    }
  };

  const handleCancelRequest = async () => {
    try {
      await cancelConnectionRequest(connectionId);
      setStatus('none');
      setConnectionId(null);
      setIsRequester(false);
      notify('Connection request cancelled', { type: 'info' });
    } catch (err) {
      notify(err.message || 'Failed to cancel request', { type: 'error' });
    }
  };

  const handleAccept = async () => {
    try {
      await acceptConnectionRequest(connectionId);
      setStatus('accepted');
      notify('Connection request accepted', { type: 'success' });
    } catch (err) {
      notify(err.message || 'Failed to accept request', { type: 'error' });
    }
  };

  const handleReject = async () => {
    try {
      await rejectConnectionRequest(connectionId);
      setStatus('rejected');
      notify('Connection request rejected', { type: 'info' });
    } catch (err) {
      notify(err.message || 'Failed to reject request', { type: 'error' });
    }
  };

  if (loading) return <div className="loading-btn">...</div>;

  if (status === 'none') {
    return (
      <button className="btn-connect" onClick={handleSendRequest}>
        Add Friend
      </button>
    );
  }

  if (status === 'pending' && isRequester) {
    return (
      <div className="connection-status">
        <span className="status-text">Request Sent</span>
        <button className="btn-cancel" onClick={handleCancelRequest}>
          Cancel
        </button>
      </div>
    );
  }

  if (status === 'pending' && !isRequester) {
    return (
      <div className="connection-actions">
        <button className="btn-accept" onClick={handleAccept}>
          Accept
        </button>
        <button className="btn-reject" onClick={handleReject}>
          Reject
        </button>
      </div>
    );
  }

  if (status === 'accepted') {
    return (
      <div className="connection-status">
        <span className="status-friends">✓ Friends</span>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="connection-status">
        <span className="status-rejected">Request Rejected</span>
      </div>
    );
  }

  return null;
}
