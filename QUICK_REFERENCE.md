# Connection Feature - Quick Reference

## 🚀 Backend API Endpoints

```javascript
// Send connection request
POST /api/connections/send
Body: { "recipientId": "user_id" }

// Accept request
PUT /api/connections/accept/:connectionId

// Reject request
PUT /api/connections/reject/:connectionId

// Cancel sent request
DELETE /api/connections/cancel/:connectionId

// Get pending requests (received)
GET /api/connections/pending

// Get sent requests
GET /api/connections/sent

// Get friends list
GET /api/connections/friends

// Remove friend
DELETE /api/connections/friend/:friendId

// Check connection status
GET /api/connections/status/:otherUserId
```

## 💻 Frontend API Functions

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
} from './services/api';

// Usage
await sendConnectionRequest(userId);
await acceptConnectionRequest(connectionId);
const { friends } = await getFriends();
```

## 🎨 React Components

```jsx
// Main page with all features
import Connections from './pages/Connections';
<Route path="/connections" element={<Connections />} />

// Individual components
import PendingRequests from './components/PendingRequests';
import FriendsList from './components/FriendsList';
import ConnectionButton from './components/ConnectionButton';

// Use anywhere
<PendingRequests />
<FriendsList />
<ConnectionButton otherUserId={userId} otherUserName={name} />
```

## 📝 Connection Status States

```javascript
{
  status: 'none',      // No connection
  status: 'pending',   // Request pending
  status: 'accepted',  // Friends
  status: 'rejected'   // Request rejected
}
```

## 🎯 Common Patterns

### Display Connection Button on Profile
```jsx
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <ConnectionButton otherUserId={user._id} otherUserName={user.name} />
    </div>
  );
}
```

### Show Notification Badge
```jsx
const { count } = await getPendingRequests();
<Link to="/connections">
  Connections {count > 0 && `(${count})`}
</Link>
```

### Manual Status Check
```jsx
const { status, isRequester, connectionId } = await getConnectionStatus(userId);

if (status === 'none') {
  // Show "Add Friend" button
} else if (status === 'pending' && isRequester) {
  // Show "Request Sent" with cancel option
} else if (status === 'pending' && !isRequester) {
  // Show "Accept" / "Reject" buttons
} else if (status === 'accepted') {
  // Show "Friends" / "Unfriend"
}
```

## 🔒 Authentication

All endpoints require JWT token:
```javascript
headers: {
  'Authorization': 'Bearer ' + localStorage.getItem('token')
}
```

## 📁 File Structure

```
backend/
  src/
    models/Connection.js
    controllers/connectionController.js
    routes/connections.js
    index.js (updated)

frontend/
  src/
    components/
      ConnectionButton.jsx
      PendingRequests.jsx
      FriendsList.jsx
    pages/
      Connections.jsx
    services/
      api.js (updated)
    styles/
      connections.css

Documentation/
  CONNECTION_API.md
  FRONTEND_INTEGRATION.md
  README_CONNECTION_FEATURE.md
  QUICK_REFERENCE.md (this file)
```

## ⚡ Testing Commands

```bash
# Start backend
cd backend && npm run dev

# Test endpoints with curl
curl -X POST http://localhost:5000/api/connections/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"recipientId":"USER_ID"}'

# Get friends
curl http://localhost:5000/api/connections/friends \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎨 CSS Classes

```css
.connections-page
.tabs, .tab, .tab.active
.request-card, .friend-card
.btn-accept, .btn-reject, .btn-cancel, .btn-connect
.status-friends, .status-text, .status-rejected
```

## 📊 Response Examples

### Send Request Success
```json
{
  "message": "Connection request sent successfully",
  "connection": {
    "_id": "123",
    "requester": "user1",
    "recipient": "user2",
    "status": "pending"
  }
}
```

### Get Friends
```json
{
  "friends": [
    {
      "_id": "user123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "count": 1
}
```

## 🔧 Customization Tips

```jsx
// Change button colors
.btn-connect { background-color: #your-color; }

// Add profile pictures
<img src={user.avatar} alt={user.name} />

// Add real-time updates
socket.on('new-connection-request', handleNewRequest);

// Add pagination
const { friends } = await getFriends({ page: 1, limit: 10 });
```

---

## 📚 Full Documentation

- `CONNECTION_API.md` - Complete API docs
- `FRONTEND_INTEGRATION.md` - Integration guide
- `README_CONNECTION_FEATURE.md` - Full feature overview

---

That's it! Your connection feature is ready to use! 🎉
