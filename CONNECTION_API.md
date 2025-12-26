# Connection/Friend Request Feature - API Documentation

## Overview
This feature allows users to send and manage friend/connection requests similar to Facebook's friend request system.

## API Endpoints

### Base URL
`/api/connections`

### Authentication
All endpoints require authentication. Include JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Send Connection Request
**POST** `/api/connections/send`

Send a friend request to another user.

**Request Body:**
```json
{
  "recipientId": "user_id_here"
}
```

**Success Response (201):**
```json
{
  "message": "Connection request sent successfully",
  "connection": {
    "_id": "connection_id",
    "requester": "your_user_id",
    "recipient": "recipient_user_id",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Invalid recipient ID, self-request, or request already exists
- `404` - User not found
- `500` - Server error

---

### 2. Accept Connection Request
**PUT** `/api/connections/accept/:connectionId`

Accept a pending connection request.

**URL Parameters:**
- `connectionId` - ID of the connection request

**Success Response (200):**
```json
{
  "message": "Connection request accepted",
  "connection": {
    "_id": "connection_id",
    "requester": "requester_user_id",
    "recipient": "your_user_id",
    "status": "accepted",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `403` - Not authorized (you are not the recipient)
- `404` - Connection request not found
- `400` - Request is not pending
- `500` - Server error

---

### 3. Reject Connection Request
**PUT** `/api/connections/reject/:connectionId`

Reject a pending connection request.

**URL Parameters:**
- `connectionId` - ID of the connection request

**Success Response (200):**
```json
{
  "message": "Connection request rejected",
  "connection": {
    "_id": "connection_id",
    "requester": "requester_user_id",
    "recipient": "your_user_id",
    "status": "rejected",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `403` - Not authorized (you are not the recipient)
- `404` - Connection request not found
- `400` - Request is not pending
- `500` - Server error

---

### 4. Cancel Connection Request
**DELETE** `/api/connections/cancel/:connectionId`

Cancel a pending connection request you sent.

**URL Parameters:**
- `connectionId` - ID of the connection request

**Success Response (200):**
```json
{
  "message": "Connection request cancelled successfully"
}
```

**Error Responses:**
- `403` - Not authorized (you are not the requester)
- `404` - Connection request not found
- `400` - Can only cancel pending requests
- `500` - Server error

---

### 5. Get Pending Requests
**GET** `/api/connections/pending`

Get all pending connection requests received by you.

**Success Response (200):**
```json
{
  "pendingRequests": [
    {
      "_id": "connection_id",
      "requester": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "recipient": "your_user_id",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

**Error Responses:**
- `500` - Server error

---

### 6. Get Sent Requests
**GET** `/api/connections/sent`

Get all pending connection requests you sent.

**Success Response (200):**
```json
{
  "sentRequests": [
    {
      "_id": "connection_id",
      "requester": "your_user_id",
      "recipient": {
        "_id": "user_id",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

**Error Responses:**
- `500` - Server error

---

### 7. Get Friends
**GET** `/api/connections/friends`

Get all your friends (accepted connections).

**Success Response (200):**
```json
{
  "friends": [
    {
      "_id": "user_id",
      "name": "Friend Name",
      "email": "friend@example.com"
    }
  ],
  "count": 1
}
```

**Error Responses:**
- `500` - Server error

---

### 8. Remove Friend
**DELETE** `/api/connections/friend/:friendId`

Remove a friend/unfriend a user.

**URL Parameters:**
- `friendId` - ID of the friend to remove

**Success Response (200):**
```json
{
  "message": "Friend removed successfully"
}
```

**Error Responses:**
- `404` - Friendship not found
- `500` - Server error

---

### 9. Get Connection Status
**GET** `/api/connections/status/:otherUserId`

Check the connection status with another user.

**URL Parameters:**
- `otherUserId` - ID of the other user

**Success Response (200):**
```json
{
  "status": "accepted",
  "isRequester": true,
  "connectionId": "connection_id"
}
```

**Possible status values:**
- `"none"` - No connection request exists
- `"pending"` - Connection request is pending
- `"accepted"` - You are friends
- `"rejected"` - Connection request was rejected

**Error Responses:**
- `500` - Server error

---

## Database Schema

### Connection Model
```javascript
{
  requester: ObjectId (ref: User),
  recipient: ObjectId (ref: User),
  status: String (enum: ['pending', 'accepted', 'rejected']),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Unique compound index on `requester` and `recipient`

---

## Example Usage Flow

### Sending and Accepting a Friend Request

1. **User A sends a request to User B:**
```bash
POST /api/connections/send
{
  "recipientId": "user_b_id"
}
```

2. **User B views pending requests:**
```bash
GET /api/connections/pending
```

3. **User B accepts the request:**
```bash
PUT /api/connections/accept/connection_id
```

4. **Both users can now see each other in their friends list:**
```bash
GET /api/connections/friends
```

### Checking Connection Status Before Sending Request

```bash
GET /api/connections/status/other_user_id
```

This will tell you if you're already friends, have a pending request, or have no connection.

---

## Frontend Integration Tips

1. **Before showing "Add Friend" button**, check connection status
2. **Show different buttons** based on status:
   - `none` → "Add Friend" button
   - `pending` with `isRequester: true` → "Request Sent" (with cancel option)
   - `pending` with `isRequester: false` → "Accept" / "Reject" buttons
   - `accepted` → "Friends" / "Unfriend" button
3. **Display notification badge** for pending requests count
4. **Refresh friend list** after accepting/rejecting requests

---

## Testing with Postman

Import the `postman_collection.json` and add these requests to test the connection feature.

Example test scenarios:
1. Create two test users
2. Login as User A and send request to User B
3. Login as User B and accept the request
4. Verify both users see each other in friends list
5. Test error cases (duplicate requests, invalid IDs, etc.)
