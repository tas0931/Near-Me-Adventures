import React, { useEffect, useRef, useState } from 'react';
import { getChatMessages, postChatMessage } from '../services/api';
import { useNotifications } from '../contexts/NotificationsContext';
import '../styles/chat.css';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);
  const { add } = useNotifications();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await getChatMessages();
        if (!mounted) return;
        const newList = res.messages || [];
        const totalCount = Array.isArray(newList) ? newList.length : 0;

        // Dispatch total message count
        try {
          window.dispatchEvent(new CustomEvent('chat:total-count', { detail: { total: totalCount } }));
        } catch (e) { /* ignore */ }

        setMessages(newList);
      } catch (err) {
        add('Could not load chat messages', { type: 'error' });
      } finally {
        setLoading(false);
      }
    }
    load();
    const iv = setInterval(load, 3000);
    return () => { mounted = false; clearInterval(iv); };
  }, [add]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    if (!text.trim()) return;
    const payload = { text: text.trim() };
    try {
      const res = await postChatMessage(payload);
      setText('');
      if (res && res.message) {
        setMessages(prev => prev.concat(res.message));
      } else {
        const fresh = await getChatMessages();
        setMessages(fresh.messages || []);
      }
    } catch (err) {
      add('Failed to send message', { type: 'error' });
    }
  };

  return (
    <div className="page">
      <div className="brand">
        <h2 className="brand-heading">Community Chat</h2>
      </div>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Connect with fellow adventurers! Share tips, ask questions, and plan your next near-me adventure together.
      </p>

      <div className="chat-container" ref={listRef}>
        {loading ? (
          <p style={{ color: 'var(--text-primary)' }}>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p style={{ color: 'var(--text-primary)' }}>No messages yet. Say hello!</p>
        ) : (
          messages.map(m => (
            <div key={m._id || m.id} className="chat-message">
              <div className="chat-message-sender">
                {m.senderName || (m.sender && (m.sender.name || m.sender.email))}
              </div>
              <div className="chat-message-text">{m.text}</div>
              <div className="chat-message-time">
                {new Date(m.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="chat-input-container">
        <input 
          className="chat-input"
          value={text} 
          onChange={e => setText(e.target.value)} 
          onKeyPress={e => e.key === 'Enter' && send()}
          placeholder="Write a message..." 
        />
        <button className="chat-send-button" onClick={send}>Send</button>
      </div>
    </div>
  );
}

