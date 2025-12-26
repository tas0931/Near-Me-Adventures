# NM Adventures
## Overview
NM Adventures is a full-stack web application built using the MERN (MongoDB, Express, React, Node.js) stack. The application allows users to register and receive travel suggestions based on their preferences.

## Features
- User registration
- Authentication
- Travel suggestions based on user input

## Project Structure
```
NM Adventures
├── frontend              # Frontend application (formerly client)
│   ├── package.json      # Client dependencies and scripts
│   ├── public
│   │   └── index.html    # Main HTML file
│   └── src
│       ├── index.jsx     # Entry point for React app
│       ├── App.jsx       # Main App component
│       ├── pages
│       │   └── Register.jsx  # Registration page
│       ├── components
│       │   └── AuthForm.jsx   # Authentication form component
│       ├── services
│       │   └── api.js        # API calls to backend
│       ├── hooks
│       │   └── useAuth.js     # Custom hook for authentication
│       └── styles
│           └── main.css       # Main styles
├── backend               # Backend application (formerly server)
│   ├── package.json      # Server dependencies and scripts
│   ├── .env              # Environment variables
│   └── src
│       ├── index.js      # Entry point for server app
│       ├── config
│       │   └── db.js     # Database connection
│       ├── controllers
│       │   └── authController.js  # Authentication logic
│       ├── models
│       │   └── User.js    # User model
│       ├── routes
│       │   └── auth.js    # Authentication routes
│       └── middleware
│           └── auth.js     # Authentication middleware
├── .gitignore
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd travel-suggestor
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

### Configuration
- Create/Edit `backend/.env` and set MONGO_URI, JWT_SECRET, PORT

### Running the Application

1. Start the backend:
   ```
   cd backend
   npm start
   ```

2. Start the frontend:
   ```
   cd frontend
   npm start
   ```

### Usage
- Navigate to `http://localhost:3000` to access the application.
- Use the registration page to create a new account.
