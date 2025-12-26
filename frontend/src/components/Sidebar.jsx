import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/sidebar.css';

export default function Sidebar({ isOpen, unreadChat, pendingConnections }) {
  // Check if current user is admin
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const navItems = [
    { path: '/home', icon: '🏠', label: 'Home' },
   // { path: '/browse', icon: '🔍', label: 'Premium Experiences' },
    { path: '/all-places', icon: '📍', label: 'All Places' },
    { path: '/suggest-places', icon: '💡', label: 'Suggest Places' },
    { path: '/trending', icon: '🔥', label: 'Trending' },
    { path: '/recommendation', icon: '⭐', label: 'Recommendations' },
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/find-people', icon: '🔎', label: 'Find People' },
    { path: '/connections', icon: '👥', label: 'Connections', badge: pendingConnections },
    { path: '/messages', icon: '✉️', label: 'Messages' },
    { path: '/reviews', icon: '💬', label: 'Reviews' },
    { path: '/chat', icon: '💭', label: 'Community Chat', badge: unreadChat },
    { path: '/payment', icon: '💳', label: 'Payment' },
  ];

  const adminItems = [
    { path: '/add-experiences', icon: '➕', label: 'Add Experience' },
    { path: '/created-experiences', icon: '📝', label: 'My Experiences' },
    { path: '/admin', icon: '⚙️', label: 'Admin Dashboard' },
    { path: '/analysis', icon: '📈', label: 'Analytics' },
  ];

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Main Menu</div>
            <nav className="sidebar-nav">
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="sidebar-badge">{item.badge}</span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {isAdmin && (
            <div className="sidebar-section">
              <div className="sidebar-section-title">Management</div>
              <nav className="sidebar-nav">
                {adminItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="sidebar-icon">{item.icon}</span>
                    <span className="sidebar-label">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>
      </aside>
      {isOpen && <div className="sidebar-overlay" />}
    </>
  );
}
