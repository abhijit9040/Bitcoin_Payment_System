import {
  sanitizeInput,
  validateEmail,
  validatePassword,
  validateWalletAddress,
  formatAmount,
  maskAddress,
  generateSecureId,
  checkForSuspiciousActivity
} from '../security';

describe('Security Utils', () => {
  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeInput('javascript:alert("xss")')).toBe('alert("xss")');
    });

    it('should handle non-string input', () => {
      expect(sanitizeInput(123)).toBe(123);
      expect(sanitizeInput(null)).toBe(null);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('Password123');
      expect(result.isValid).toBe(true);
      expect(result.errors.minLength).toBe(false);
      expect(result.errors.noUpperCase).toBe(false);
      expect(result.errors.noLowerCase).toBe(false);
      expect(result.errors.noNumbers).toBe(false);
    });

    it('should reject weak passwords', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.minLength).toBe(true);
    });
  });

  describe('validateWalletAddress', () => {
    it('should validate correct wallet addresses', () => {
      expect(validateWalletAddress('WALLET_ABC123')).toBe(true);
      expect(validateWalletAddress('WALLET_XYZ789')).toBe(true);
    });

    it('should reject invalid wallet addresses', () => {
      expect(validateWalletAddress('invalid_address')).toBe(false);
      expect(validateWalletAddress('WALLET_abc123')).toBe(false); // lowercase
      expect(validateWalletAddress('WALLET_123!')).toBe(false); // special chars
    });
  });

  describe('formatAmount', () => {
    it('should format valid amounts', () => {
      expect(formatAmount('123.456')).toBe('123.46');
      expect(formatAmount(100)).toBe('100.00');
    });

    it('should handle invalid amounts', () => {
      expect(formatAmount('invalid')).toBe('0.00');
      expect(formatAmount(null)).toBe('0.00');
    });
  });

  describe('maskAddress', () => {
    it('should mask long addresses', () => {
      expect(maskAddress('WALLET_ABCDEFGHIJKLMNOP')).toBe('WALLET...NOP');
    });

    it('should return short addresses unchanged', () => {
      expect(maskAddress('WALLET_123')).toBe('WALLET_123');
    });
  });

  describe('generateSecureId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateSecureId();
      const id2 = generateSecureId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('checkForSuspiciousActivity', () => {
    it('should detect large transactions', () => {
      const transactions = [
        {
          amount: 1500,
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
        }
      ];
      
      const result = checkForSuspiciousActivity(transactions);
      expect(result.isSuspicious).toBe(true);
      expect(result.flags.largeTransactions).toBe(true);
    });

    it('should detect rapid transactions', () => {
      const transactions = Array.from({ length: 15 }, (_, i) => ({
        amount: 10,
        timestamp: new Date(Date.now() - i * 1000 * 60).toISOString() // every minute
      }));
      
      const result = checkForSuspiciousActivity(transactions);
      expect(result.isSuspicious).toBe(true);
      expect(result.flags.rapidTransactions).toBe(true);
    });
  });
});


