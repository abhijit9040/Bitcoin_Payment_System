import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const SendMoney = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txid, setTxid] = useState('');
  const { user, updateBalance } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.recipient || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    if (parseFloat(formData.amount) > user.balance) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/pay', {
        to: formData.recipient,
        amount: parseFloat(formData.amount)
      });

      setTxid(response.data.txid);
      updateBalance(response.data.newBalance);
      setSuccess(true);
      toast.success('Payment sent successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      recipient: '',
      amount: '',
      note: ''
    });
    setSuccess(false);
    setTxid('');
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto"
      >
        <div className="card text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Sent!</h2>
          <p className="text-gray-600 mb-6">
            Your payment of ${formData.amount} has been sent successfully.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
            <p className="font-mono text-sm text-gray-900 break-all">{txid}</p>
          </div>

          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetForm}
              className="flex-1 btn-primary"
            >
              Send Another
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/'}
              className="flex-1 btn-secondary"
            >
              Go to Dashboard
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <div className="card">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Send className="w-8 h-8 text-primary-600" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Send Money</h1>
          <p className="text-gray-600">Transfer funds to any wallet address</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter wallet address"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="input-field pl-8"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                max={user.balance}
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Available balance: ${user.balance?.toFixed(2)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note (Optional)
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="input-field"
              placeholder="Add a note for this transaction"
              rows="3"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending Payment...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Send className="w-5 h-5 mr-2" />
                Send Payment
              </div>
            )}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-blue-50 rounded-lg"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Security Notice</h4>
              <p className="text-sm text-blue-700 mt-1">
                Double-check the recipient address before sending. Transactions cannot be reversed.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SendMoney;
