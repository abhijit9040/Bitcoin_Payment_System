const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { 
  createUser, 
  findUser, 
  findUserById, 
  updateUser, 
  createTransaction, 
  findTransactions 
} = require('./memory-db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

  jwt.verify(token, 'fallback-secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await findUser({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await createUser({
      username,
      email,
      password: hashedPassword,
      balance: 1000, // Starting balance
      address: generateAddress()
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      'fallback-secret',
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
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await findUser({ email });
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
      'fallback-secret',
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
    const user = await findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send payment
app.post('/api/pay', authenticateToken, async (req, res) => {
  try {
    const { to, amount } = req.body;
    
    if (!to || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payment details' });
    }

    const sender = await findUserById(req.user.userId);
    const receiver = await findUser({ address: to });

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
    const newSenderBalance = sender.balance - amount;
    const newReceiverBalance = receiver.balance + amount;

    await updateUser(sender._id, { balance: newSenderBalance });
    await updateUser(receiver._id, { balance: newReceiverBalance });

    // Create transaction record
    const transaction = await createTransaction({
      from: sender.address,
      to: receiver.address,
      amount,
      txid,
      status: 'completed'
    });

    res.json({
      message: 'Payment successful',
      txid,
      newBalance: newSenderBalance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get transactions
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const user = await findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userTransactions = await findTransactions({
      $or: [{ from: user.address }, { to: user.address }]
    });

    res.json(userTransactions.slice(0, 50)); // Limit to 50 transactions
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate QR data
app.post('/api/generate-qr', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await findUserById(req.user.userId);
    
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

    const recipient = await findUser({ address: qrData.address });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
  console.log(`💾 Using in-memory database (data will reset on restart)`);
});


