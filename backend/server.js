const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { 
  validateRegistration, 
  validateLogin, 
  validatePayment, 
  validateQRGeneration 
} = require('./middleware/validation');
const { 
  generalLimiter, 
  authLimiter, 
  paymentLimiter 
} = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalLimiter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webrtc-wallet', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 1000 }, // Starting balance
  address: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true },
  txid: { type: String, unique: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: 'completed' }
});

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

// Generate unique address
const generateAddress = () => {
  return 'WALLET_' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes

// Register
app.post('/api/register', authLimiter, validateRegistration, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      address: generateAddress()
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
app.post('/api/login', authLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send payment
app.post('/api/pay', authenticateToken, paymentLimiter, validatePayment, async (req, res) => {
  try {
    const { to, amount } = req.body;
    
    if (!to || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payment details' });
    }

    const sender = await User.findById(req.user.userId);
    const receiver = await User.findOne({ address: to });

    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    if (!receiver) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Generate transaction ID
    const txid = uuidv4();

    // Update balances
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    // Create transaction record
    const transaction = new Transaction({
      from: sender.address,
      to: receiver.address,
      amount,
      txid
    });

    await transaction.save();

    res.json({
      message: 'Payment successful',
      txid,
      newBalance: sender.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get transactions
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const transactions = await Transaction.find({
      $or: [{ from: user.address }, { to: user.address }]
    }).sort({ timestamp: -1 }).limit(50);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate QR data
app.post('/api/generate-qr', authenticateToken, validateQRGeneration, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const qrData = {
      address: user.address,
      amount: amount || null,
      timestamp: Date.now()
    };

    res.json(qrData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Parse QR data
app.post('/api/parse-qr', authenticateToken, async (req, res) => {
  try {
    const { qrData } = req.body;
    
    if (!qrData || !qrData.address) {
      return res.status(400).json({ message: 'Invalid QR code data' });
    }

    const recipient = await User.findOne({ address: qrData.address });
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    res.json({
      recipient: {
        address: recipient.address,
        username: recipient.username
      },
      amount: qrData.amount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
