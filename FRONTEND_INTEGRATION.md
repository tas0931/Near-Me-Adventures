# Connection Feature - Frontend Integration Guide

## Overview
This guide explains how to integrate the connection/friend request feature into your React frontend.

## Files Created

### Services
- `/frontend/src/services/api.js` - Updated with connection API functions

### Components
- `/frontend/src/components/PendingRequests.jsx` - Display and manage incoming requests
- `/frontend/src/components/FriendsList.jsx` - Display friends list
- `/frontend/src/components/ConnectionButton.jsx` - Smart button for connection actions

### Pages
- `/frontend/src/pages/Connections.jsx` - Main connections page with tabs

### Styles
- `/frontend/src/styles/connections.css` - Styling for all connection components

---

## Integration Steps

### 1. Import the CSS
Add to your main App.jsx or index.jsx:

```jsx
import './styles/connections.css';
```

### 2. Add Route
In your App.jsx, add the Connections page route:

```jsx
import Connections from './pages/Connections';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ... your existing routes ... */}
        <Route path="/connections" element={<Connections />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 3. Add Navigation Link
In your Navbar component:

```jsx
<Link to="/connections">Connections</Link>
```

### 4. Display Notification Badge (Optional)
Show pending requests count in the navbar:

```jsx
import { useState, useEffect } from 'react';
import { getPendingRequests } from '../services/api';

function Navbar() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const data = await getPendingRequests();
        setPendingCount(data.count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPendingCount();
    // Optionally poll every minute
    const interval = setInterval(fetchPendingCount, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav>
      <Link to="/connections">
        Connections
        {pendingCount > 0 && <span className="badge">{pendingCount}</span>}
      </Link>
    </nav>
  );
}
```

---

## Component Usage Examples

### Using ConnectionButton Component

Display the connection button on user profile pages or user lists:

```jsx
import ConnectionButton from '../components/ConnectionButton';

function UserProfile({ userId, userName }) {
  return (
    <div className="user-profile">
      <h2>{userName}</h2>
      <ConnectionButton otherUserId={userId} otherUserName={userName} />
    </div>
  );
}
```

### Using in a User List

```jsx
import ConnectionButton from '../components/ConnectionButton';
import { getAllUsers } from '../services/api';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user._id} className="user-card">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <ConnectionButton 
            otherUserId={user._id} 
            otherUserName={user.name} 
          />
        </div>
      ))}
    </div>
  );
}
```

### Standalone Components

You can also use the individual components separately:

```jsx
import PendingRequests from '../components/PendingRequests';
import FriendsList from '../components/FriendsList';

// In any page/component
function MyPage() {
  return (
    <div>
      <h1>My Dashboard</h1>
      <PendingRequests />
      <FriendsList />
    </div>
  );
}
```

---

## API Functions Reference

All functions are available from `services/api.js`:

```javascript
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  cancelConnectionRequest,
  getPendingRequests,
  getSentRequests,
  getFriends,
  removeFriend,
  getConnectionStatus
} from '../services/api';

// Send a connection request
await sendConnectionRequest(userId);

// Accept a request
await acceptConnectionRequest(connectionId);

// Reject a request
await rejectConnectionRequest(connectionId);

// Cancel a sent request
await cancelConnectionRequest(connectionId);

// Get pending requests (received)
const { pendingRequests, count } = await getPendingRequests();

// Get sent requests
const { sentRequests, count } = await getSentRequests();

// Get friends list
const { friends, count } = await getFriends();

// Remove a friend
await removeFriend(friendId);

// Check connection status with a user
const { status, isRequester, connectionId } = await getConnectionStatus(userId);
```

---

## Connection Status States

The `getConnectionStatus` function returns one of these states:

- **`none`** - No connection exists
- **`pending`** - Connection request is pending
  - `isRequester: true` - You sent the request
  - `isRequester: false` - You received the request
- **`accepted`** - You are friends
- **`rejected`** - Request was rejected

---

## Styling Customization

Modify `/frontend/src/styles/connections.css` to match your app's design:

```css
/* Example: Change primary color */
.btn-connect {
  background-color: #your-brand-color;
}

.tab.active {
  color: #your-brand-color;
  border-bottom-color: #your-brand-color;
}
```

---

## Advanced Features

### Real-time Updates with WebSockets

To add real-time notifications when someone sends you a request:

```jsx
import { useEffect } from 'react';
import io from 'socket.io-client';

function useConnectionNotifications() {
  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('new-connection-request', (data) => {
      // Show notification
      alert(`${data.requesterName} sent you a connection request!`);
      // Refresh pending requests
    });

    return () => socket.disconnect();
  }, []);
}
```

### Search and Filter Friends

```jsx
function FriendsList() {
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState('');

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search friends..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredFriends.map(friend => (
        <div key={friend._id}>{friend.name}</div>
      ))}
    </div>
  );
}
```

### Mutual Friends Feature

To show mutual friends, you'd need to add a backend endpoint that compares friend lists.

---

## Testing Checklist

- [ ] Navigate to `/connections` page
- [ ] View friends list tab
- [ ] View pending requests tab
- [ ] View sent requests tab
- [ ] Send a connection request from user A to user B
- [ ] Login as user B and see the pending request
- [ ] Accept the request
- [ ] Both users should see each other in friends list
- [ ] Test reject functionality
- [ ] Test cancel sent request
- [ ] Test unfriend functionality
- [ ] Verify connection button shows correct state
- [ ] Test error handling (invalid user IDs, etc.)

---

## Troubleshooting

### "Failed to load friends"
- Ensure you're logged in (JWT token in localStorage)
- Check backend is running on port 5000
- Verify CORS is enabled in backend

### Connection button not updating
- Check that `otherUserId` prop is valid
- Ensure component re-renders after actions
- Check browser console for errors

### Styles not applying
- Import connections.css in your main App.jsx
- Check for CSS specificity conflicts
- Clear browser cache

---

## Next Steps

1. **Add notifications** - Show toast/snackbar when requests are received
2. **Add pagination** - For large friend lists
3. **Add search** - Search for users to connect with
4. **Add mutual friends** - Show mutual connections
5. **Add friend suggestions** - Recommend people to connect with
6. **Add profile links** - Click friend to view their profile

---

## Example: Complete User Directory with Connection

```jsx
import { useState, useEffect } from 'react';
import { getAllUsers } from '../services/api';
import ConnectionButton from '../components/ConnectionButton';

function UserDirectory() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-directory">
      <h1>Find People</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <div className="users-grid">
        {filteredUsers.map(user => (
          <div key={user._id} className="user-card">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <ConnectionButton 
              otherUserId={user._id} 
              otherUserName={user.name} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDirectory;
```

This completes the connection feature implementation! 🎉
