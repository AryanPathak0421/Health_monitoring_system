# Emergency Health Monitoring Backend

This is the backend system for the Emergency Health Monitoring Wearable platform, built with Node.js, Express, MongoDB, and Socket.IO.

## Features
- Real-time health data processing (REST API).
- Real-time communication via Socket.IO.
- Emergency threshold checking and alert creation.
- MongoDB for persistent storage.

## Folder Structure
```
backend/
├── src/
│   ├── config/         # Database, environment variables
│   ├── controllers/    # Request handlers (REST APIs)
│   ├── models/         # Mongoose schemas (User, Device, HealthLog, Alert)
│   ├── routes/         # API routes
│   ├── services/       # Business logic (alert analysis)
│   ├── utils/          # Helper functions (logger)
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point & Socket.IO initialization
├── .env                # Environment variables
├── package.json        # Dependencies
└── README.md           # Documentation
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB running locally or a cloud instance.

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup environment variables:
   Create a `.env` file in the root directory.
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/health_monitoring
   ```

### Running the Server
- Start production server:
  ```bash
  npm start
  ```
- Start development server (with auto-reload):
  ```bash
  npm run dev
  ```
