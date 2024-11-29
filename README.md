# Chat Application Backend

This is the backend for a real-time chat application built with Strapi. It provides WebSocket functionality for real-time communication and REST APIs for user authentication and data management.

## Features

- WebSocket server for real-time messaging
- User authentication and authorization
- Chat session management
- Message storage and retrieval
- RESTful API endpoints

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (if using MongoDB as database)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
```

### Development

Start the development server with auto-reload:
```bash
npm run develop
# or
yarn develop
```

### Production

Start the production server:
```bash
npm run start
# or
yarn start
```

Build the admin panel:
```bash
npm run build
# or
yarn build
```

## API Documentation

### REST Endpoints

- `POST /auth/local/register` - User registration
- `POST /auth/local` - User login
- `GET /messages` - Retrieve messages
- `POST /messages` - Create a new message

### WebSocket

The WebSocket server is configured to echo messages back to the client. Connect to the WebSocket server at:
```
ws://localhost:1337/ws
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret
```

## Technology Stack

- Strapi (Headless CMS)
- Socket.io (WebSocket)
- JWT Authentication
- PostgreSQL (Database)

## Deployment

For deployment instructions, refer to the [Strapi Deployment Documentation](https://docs.strapi.io/dev-docs/deployment).

## Additional Resources

- [Strapi Documentation](https://docs.strapi.io)
- [WebSocket Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
