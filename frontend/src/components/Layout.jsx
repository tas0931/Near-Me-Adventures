import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { getProfile, getPendingRequests } from '../services/api';
import '../styles/layout.css';

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadChat, setUnreadChat] = useState(0);
  const [pendingConnections, setPendingConnections] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await getProfile();
        setUser(res.user);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
    load();
  }, [navigate]);

  useEffect(() => {
    async function loadPendingConnections() {
      try {
        const res = await getPendingRequests();
        setPendingConnections(res.count || 0);
      } catch (err) {
        console.error('Failed to load pending connections:', err);
      }
    }
    loadPendingConnections();
    const interval = setInterval(loadPendingConnections, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const total = e?.detail?.total || 0;
      setUnreadChat(total);
    };
    window.addEventListener('chat:total-count', handler);
    return () => window.removeEventListener('chat:total-count', handler);
  }, []);

  useEffect(() => {
    const handler = () => {
      setPendingConnections(c => c + 1);
    };
    window.addEventListener('connection:new-request', handler);
    return () => window.removeEventListener('connection:new-request', handler);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="app-layout">
      <Navbar user={user} onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} unreadChat={unreadChat} pendingConnections={pendingConnections} />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {children}
      </main>
    </div>
  );
}
