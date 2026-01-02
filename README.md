# NM Adventures
## Overview
NM Adventures is a full-stack web application built using the MERN (MongoDB, Express, React, Node.js) stack. The application allows users to register and receive travel suggestions based on their preferences.

## Features
             1.  Wishlist- for later bookings : Enables users to save online-listed events (offline or online events) to a wishlist for easy access and future booking.

             2.  Admin Panel – User Monitoring : Allows administrators to view, search, and 
                Manage user accounts, including deleting users when necessary.
           
            3. Community Chat Box : Enables all users to communicate, share information and 
                Interact with each other through a common chat platform.

            4. Trending Dashboard and Recommendations : Displays the most trending 
                 Places on the platform based on booking popularity and provide personalized
                 recommendations based on user-selected preferences.

            5. Browse All Experiences : Allows users to explore and view all available events 
                And experiences listed on the platform. 

            6. Create Experiences from Admin Panel : Enables administrators to add new 
                events or experiences with relevant details through the admin panel.

            7. View Experiences from Admin Panel : Allows administrators to monitor, search,  
               and delete existing events or experiences for effective management.

            8. Booking Management : Allows users to create, view, and cancel their event 
                bookings through the platform.

           9. Analytics Dashboard :  Allows administrators to view the total number of users, 
               access the user list, search for users by name or email, and track each user’s total 
               Bookings and Wishlist. 
          
          10.  Search and Filter on All Places :  Allows users to search and apply filters to find 
                 places or events based on title, event duration and price.
 
           11. Suggest Places: Enables users to recommend new places or events not 
                 currently listed on the website.

           12. Payment : Allows users to securely complete online payments for event bookings 
                 using supported digital payment methods.

           13.  View Reviews & Submit Reviews : Enables users to read reviews from other 
                  users and submit their own feedback for events or experiences they have 
                  attended.
   
            14.  User Discovery and Connection (Friendship Management) : Allows users to 
                   discover other users on the platform, send friend requests, accept or reject 
                   incoming requests, and manage existing connections by unfriending users.

           15.  Direct Messaging : Enables users to communicate privately through direct 
                   messages once they are connected as friends.

            16. Review Management (Admin Panel) : Allows administrators to view all
                 reviews, search reviews by user name or email, and delete inappropriate or 
                 unwanted reviews.


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

