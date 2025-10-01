const { body, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body('username')
    .isLength({ min: 3, max: 32 })
    .withMessage('Username must be between 3 and 32 characters')
    .matches(/^[a-zA-Z0-9_\-.]+$/)
    .withMessage('Username can only contain letters, numbers, underscore, dash, and dot'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Payment validation
const validatePayment = [
  body('to')
    .notEmpty()
    .withMessage('Recipient address is required')
    .matches(/^WALLET_[A-Z0-9]+$/)
    .withMessage('Invalid recipient address format'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0.01'),
  handleValidationErrors
];

// QR generation validation
const validateQRGeneration = [
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0.01'),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validatePayment,
  validateQRGeneration,
  handleValidationErrors
};


