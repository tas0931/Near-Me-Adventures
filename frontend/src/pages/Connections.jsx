import React, { useState } from 'react';
import PendingRequests from '../components/PendingRequests';
import FriendsList from '../components/FriendsList';
import { getSentRequests, cancelConnectionRequest } from '../services/api';
import { useNotifications } from '../contexts/NotificationsContext';

export default function Connections() {
  const { add: notify } = useNotifications();
  const [activeTab, setActiveTab] = useState('friends');
  const [sentRequests, setSentRequests] = useState([]);
  const [loadingSent, setLoadingSent] = useState(false);

  const loadSentRequests = async () => {
    try {
      setLoadingSent(true);
      const data = await getSentRequests();
      setSentRequests(data.sentRequests || []);
    } catch (err) {
      console.error('Failed to load sent requests:', err);
    } finally {
      setLoadingSent(false);
    }
  };

  const handleCancelRequest = async (connectionId) => {
    try {
      await cancelConnectionRequest(connectionId);
      setSentRequests(sentRequests.filter(r => r._id !== connectionId));
      notify('Connection request cancelled', { type: 'info' });
    } catch (err) {
      notify(err.message || 'Failed to cancel request', { type: 'error' });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'sent') {
      loadSentRequests();
    }
  };

  return (
    <div className="connections-page">
      <div className="connections-header">
        <h1>Connections</h1>
        <div className="tabs">
          <button
            className={activeTab === 'friends' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('friends')}
          >
            Friends
          </button>
          <button
            className={activeTab === 'pending' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('pending')}
          >
            Pending Requests
          </button>
          <button
            className={activeTab === 'sent' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('sent')}
          >
            Sent Requests
          </button>
        </div>
      </div>

      <div className="connections-content">
        {activeTab === 'friends' && <FriendsList />}
        
        {activeTab === 'pending' && <PendingRequests />}
        
        {activeTab === 'sent' && (
          <div className="sent-requests">
            <h2>Sent Requests ({sentRequests.length})</h2>
            {loadingSent ? (
              <div className="loading">Loading...</div>
            ) : sentRequests.length === 0 ? (
              <p>No sent requests</p>
            ) : (
              <div className="requests-list">
                {sentRequests.map(request => (
                  <div key={request._id} className="request-card">
                    <div className="user-info">
                      <h3>{request.recipient.name}</h3>
                      <p>{request.recipient.email}</p>
                      <small>Sent: {new Date(request.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div className="actions">
                      <button
                        className="btn-cancel"
                        onClick={() => handleCancelRequest(request._id)}
                      >
                        Cancel Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
