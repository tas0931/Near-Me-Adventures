import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConversations, getFriends } from '../services/api';
import '../styles/directChat.css';

export default function Messages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('conversations');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [convData, friendsData] = await Promise.all([
        getConversations(),
        getFriends()
      ]);
      
      setConversations(convData.conversations || []);
      setFriends(friendsData.friends || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const startChat = (userId) => {
    navigate(`/direct-chat/${userId}`);
  };

  if (loading) return <div className="loading-container">Loading...</div>;

  return (
    <div className="messages-page">
      <div className="messages-header">
        <h1>Messages</h1>
        <div className="tabs">
          <button
            className={activeTab === 'conversations' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('conversations')}
          >
            Conversations
          </button>
          <button
            className={activeTab === 'friends' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('friends')}
          >
            All Friends
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {activeTab === 'conversations' && (
        <div className="conversations-list">
          {conversations.length === 0 ? (
            <div className="no-conversations">
              <p>No conversations yet</p>
              <p className="hint">Start chatting with your friends!</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.user._id}
                className="conversation-item"
                onClick={() => startChat(conv.user._id)}
              >
                <div className="conv-avatar">
                  {conv.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="conv-details">
                  <div className="conv-header">
                    <h3>{conv.user.name}</h3>
                    <span className="conv-time">
                      {new Date(conv.lastMessageTime).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="conv-last-message">{conv.lastMessage}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="unread-badge">{conv.unreadCount}</span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'friends' && (
        <div className="friends-list">
          {friends.length === 0 ? (
            <div className="no-friends">
              <p>No friends yet</p>
              <p className="hint">Add friends to start messaging!</p>
            </div>
          ) : (
            friends.map((friend) => (
              <div
                key={friend._id}
                className="friend-item"
                onClick={() => startChat(friend._id)}
              >
                <div className="friend-avatar">
                  {friend.name.charAt(0).toUpperCase()}
                </div>
                <div className="friend-details">
                  <h3>{friend.name}</h3>
                  <p>{friend.email}</p>
                </div>
                <button className="chat-button">
                  Chat
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
