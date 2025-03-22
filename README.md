# busboyPOS - Cross-Platform Restaurant Management System

A comprehensive restaurant management system with multi-tenant architecture, supporting four user roles: Customers, Kitchen Staff, Restaurant Administrators, and Platform Administrators.

## Features

### Customer Features
- QR code-based menu access
- Real-time order placement and tracking
- In-app payment processing
- Order history

### Kitchen Staff Features
- Real-time order queue management
- Order status updates
- Preparation workflow management

### Restaurant Administrator Features
- Menu management (categories, items, modifiers)
- Staff account management
- Order analytics and reporting
- Restaurant settings configuration

### Platform Administrator Features
- Restaurant onboarding and management
- Multi-tenant configuration
- Platform analytics
- Billing management

## Tech Stack

### Backend
- Node.js/Express.js
- MongoDB
- Socket.io
- JWT Authentication
- Stripe Payment Integration
- Redis for Caching
- AWS S3 for File Storage

### Frontend
- React.js
- Redux
- Tailwind CSS

### Mobile
- React Native

### DevOps
- Docker
- Kubernetes
- GitHub Actions
- AWS Deployment

## Project Structure
```
busboyPOS/
├── backend/           # Express.js API server
├── frontend/          # React.js web application
└── mobile/            # React Native mobile app
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Redis
- Docker (optional)

### Installation

#### Development with Local Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/busboyPOS.git
cd busboyPOS
```

2. Install backend dependencies
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
npm start
```

4. Install mobile app dependencies
```bash
cd ../mobile
npm install
npx react-native start
```

#### Development with Docker

```bash
docker-compose up -d
```

This will start the backend API, MongoDB, Redis, and frontend web application.

## API Documentation
API documentation is available via Swagger at `/api-docs` when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Deployment

Deployment instructions will be provided in the future.

## License
MIT
