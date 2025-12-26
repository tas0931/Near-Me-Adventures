import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConversation, sendDirectMessage, getProfile } from '../services/api';
import { useNotifications } from '../contexts/NotificationsContext';
import '../styles/directChat.css';

export default function DirectChat() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { add: notify } = useNotifications();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (userId && currentUserId) {
      loadConversation();
      const interval = setInterval(loadConversation, 3000);
      return () => clearInterval(interval);
    }
  }, [userId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadCurrentUser = async () => {
    try {
      const res = await getProfile();
      setCurrentUserId(res.user._id);
    } catch (err) {
      console.error('Failed to load user profile:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = async () => {
    try {
      const data = await getConversation(userId);
      setMessages(data.messages || []);
      
      if (data.messages && data.messages.length > 0) {
        const firstMsg = data.messages[0];
        const other = firstMsg.sender._id === currentUserId ? firstMsg.recipient : firstMsg.sender;
        setOtherUser(other);
      }
      
      setError('');
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load messages');
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();

    if (!newMessage.trim()) return;

    try {
      setSending(true);
      await sendDirectMessage(userId, newMessage.trim());
      setNewMessage('');
      await loadConversation();
    } catch (err) {
      notify(err.message || 'Failed to send message', { type: 'error' });
    } finally {
      setSending(false);
    }
  };

  if (loading || !currentUserId) return <div className="loading-container">Loading conversation...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="direct-chat-page">
      <div className="chat-header">
        <button className="back-button" onClick={() => navigate('/messages')}>
          ← Back
        </button>
        <div className="chat-user-info">
          {otherUser && (
            <>
              <div className="chat-avatar">
                {otherUser.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>{otherUser.name}</h3>
                <p className="user-status">Active</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`message ${msg.sender._id === currentUserId ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p className="message-text">{msg.text}</p>
                <span className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-form" onSubmit={handleSend}>
        <div className="chat-input-container">
          <input
            className="chat-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Write a message..."
            disabled={sending}
          />
          <button
            type="button"
            className="chat-send-button"
            onClick={handleSend}
            disabled={sending || !newMessage.trim()}
            aria-label="Send"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
