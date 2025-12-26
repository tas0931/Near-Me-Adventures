import React, { useState, useEffect } from 'react';
import { browseUsers } from '../services/api';
import ConnectionButton from '../components/ConnectionButton';
import '../styles/userDirectory.css';

export default function FindPeople() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await browseUsers();
      setUsers(data.users || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-container">Loading users...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="find-people-page">
      <div className="find-people-header">
        <h1>Find People</h1>
        <p className="subtitle">Connect with other travelers and adventurers</p>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <span className="search-count">{filteredUsers.length} users found</span>
      </div>

      <div className="users-grid">
        {filteredUsers.length === 0 ? (
          <div className="no-users">
            <p>No users found matching your search.</p>
          </div>
        ) : (
          filteredUsers.map(user => (
            <div key={user._id} className="user-card">
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <h3 className="user-name">{user.name}</h3>
                <p className="user-email">{user.email}</p>
                {user.createdAt && (
                  <p className="user-joined">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="user-actions">
                <ConnectionButton 
                  otherUserId={user._id} 
                  otherUserName={user.name} 
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
