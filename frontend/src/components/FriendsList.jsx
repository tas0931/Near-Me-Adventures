import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFriends, removeFriend } from '../services/api';
import { useNotifications } from '../contexts/NotificationsContext';
import { useConfirm } from '../hooks/useConfirm';
import ConfirmDialog from './ConfirmDialog';

export default function FriendsList() {
  const navigate = useNavigate();
  const { add: notify } = useNotifications();
  const { confirmState, confirm } = useConfirm();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      setLoading(true);
      const data = await getFriends();
      setFriends(data.friends || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async (friendId, friendName) => {
    const confirmed = await confirm({
      title: 'Remove Friend',
      message: `Are you sure you want to remove ${friendName || 'this person'} from your friends?`,
      confirmText: 'Remove',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      await removeFriend(friendId);
      setFriends(friends.filter(f => f._id !== friendId));
      notify('Friend removed successfully', { type: 'success' });
    } catch (err) {
      notify(err.message || 'Failed to remove friend', { type: 'error' });
    }
  };

  const handleMessage = (friendId) => {
    navigate(`/direct-chat/${friendId}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="friends-list">
      <h2>My Friends ({friends.length})</h2>
      {friends.length === 0 ? (
        <p>No friends yet. Start connecting!</p>
      ) : (
        <div className="friends-grid">
          {friends.map(friend => (
            <div key={friend._id} className="friend-card">
              <div className="friend-info">
                <h3>{friend.name}</h3>
                <p>{friend.email}</p>
              </div>
              <div className="friend-actions">
                <button
                  className="btn-message"
                  onClick={() => handleMessage(friend._id)}
                >
                  Message
                </button>
                <button
                  className="btn-remove"
                  onClick={() => handleRemoveFriend(friend._id, friend.name)}
                >
                  Unfriend
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog {...confirmState} />
    </div>
  );
}
