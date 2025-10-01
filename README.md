# WebRTC Wallet App

A full-stack WebRTC Wallet application with Scan & Pay functionality built with React, Node.js, and MongoDB.

## Features

### Frontend (React + Tailwind + Framer Motion)
- **Authentication**: JWT-based login/signup with animated form transitions
- **Dashboard**: Balance display with smooth loading shimmer and transaction history
- **Send Money**: Enter recipient address & amount with API integration
- **Receive Money**: Generate QR codes containing wallet address and amount
- **Scan & Pay**: Camera-based QR code scanning with payment confirmation
- **Animations**: Framer Motion transitions, popups, and hover effects

### Backend (Node.js + Express + MongoDB)
- **User System**: JWT authentication with secure password hashing
- **Payments**: Real-time balance updates and transaction processing
- **QR Integration**: Generate and parse payment QR codes
- **Transactions**: Complete transaction history with MongoDB storage

## Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, react-qr-reader, qrcode.react
- **Backend**: Node.js, Express, MongoDB, JWT, bcryptjs
- **Real-time**: WebRTC (optional for peer-to-peer features)

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd webrtc-wallet-app
npm run install-all
```

2. **Set up environment variables:**
```bash
# Copy the example environment file
cp backend/env.example backend/.env

# Edit backend/.env with your configuration:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/webrtc-wallet
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

3. **Start MongoDB:**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env file
```

4. **Run the application:**
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run server  # Backend only
npm run client  # Frontend only
```

5. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile (protected)

### Payments
- `POST /api/pay` - Send payment
- `GET /api/transactions` - Get transaction history
- `POST /api/generate-qr` - Generate QR code data
- `POST /api/parse-qr` - Parse QR code data

## Usage

### 1. Registration/Login
- Create an account or login with existing credentials
- Each user gets a unique wallet address and starting balance

### 2. Dashboard
- View current balance and transaction history
- Quick access to send, receive, and scan features

### 3. Send Money
- Enter recipient wallet address
- Specify amount and optional note
- Confirm and send payment

### 4. Receive Money
- Generate QR code with your wallet address
- Set optional amount for the QR code
- Share QR code or wallet address

### 5. Scan & Pay
- Use camera to scan payment QR codes
- Review payment details
- Confirm and complete payment

## Project Structure

```
webrtc-wallet-app/
├── backend/
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── env.example        # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── api/          # API configuration
│   │   └── App.js        # Main app component
│   ├── package.json      # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── package.json          # Root package.json
└── README.md            # This file
```

## Features in Detail

### Authentication System
- Secure JWT-based authentication
- Password hashing with bcryptjs
- Protected routes and API endpoints
- Automatic token refresh

### Payment Processing
- Real-time balance updates
- Transaction validation
- Unique transaction IDs
- Complete audit trail

### QR Code Integration
- Generate payment QR codes
- Camera-based QR scanning
- Parse payment information
- Download QR codes as images

### UI/UX Features
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Loading states and error handling
- Toast notifications
- Modern card-based layout

## Development

### Adding New Features
1. Backend: Add routes in `server.js`
2. Frontend: Create components in `src/components/`
3. API: Update `src/api/axios.js` if needed

### Database Schema
- **Users**: username, email, password, balance, address
- **Transactions**: from, to, amount, txid, timestamp, status

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Vercel, or similar platform

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or similar platform
3. Update API base URL in production

## Security Considerations

- JWT tokens with expiration
- Password hashing with bcryptjs
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

