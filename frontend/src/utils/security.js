// Security utilities for the frontend

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
    errors: {
      minLength: password.length < minLength,
      noUpperCase: !hasUpperCase,
      noLowerCase: !hasLowerCase,
      noNumbers: !hasNumbers
    }
  };
};

export const validateWalletAddress = (address) => {
  const addressRegex = /^WALLET_[A-Z0-9]+$/;
  return addressRegex.test(address);
};

export const formatAmount = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0.00';
  return num.toFixed(2);
};

export const maskAddress = (address) => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const generateSecureId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const encryptSensitiveData = (data) => {
  // In a real application, you would use proper encryption
  // This is just a placeholder for demonstration
  return btoa(JSON.stringify(data));
};

export const decryptSensitiveData = (encryptedData) => {
  // In a real application, you would use proper decryption
  // This is just a placeholder for demonstration
  try {
    return JSON.parse(atob(encryptedData));
  } catch (error) {
    return null;
  }
};

export const checkForSuspiciousActivity = (transactions) => {
  // Simple heuristic to detect suspicious activity
  const recentTransactions = transactions.filter(
    tx => Date.now() - new Date(tx.timestamp).getTime() < 24 * 60 * 60 * 1000
  );
  
  const largeTransactions = recentTransactions.filter(
    tx => tx.amount > 1000
  );
  
  const rapidTransactions = recentTransactions.length > 10;
  
  return {
    isSuspicious: largeTransactions.length > 0 || rapidTransactions,
    flags: {
      largeTransactions: largeTransactions.length > 0,
      rapidTransactions
    }
  };
};

