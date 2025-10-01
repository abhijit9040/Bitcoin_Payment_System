import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useWebRTC } from '../hooks/useWebRTC';
import toast from 'react-hot-toast';

const WebRTCPayment = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  const {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    sendPaymentData
  } = useWebRTC();

  const handleSendPayment = async () => {
    if (!amount || !recipient) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!isConnected) {
      toast.error('Please connect to a peer first');
      return;
    }

    setSending(true);

    try {
      const paymentData = {
        type: 'payment',
        amount: parseFloat(amount),
        recipient,
        timestamp: Date.now()
      };

      sendPaymentData(paymentData);
      setSent(true);
      toast.success('Payment sent via WebRTC!');
    } catch (error) {
      toast.error('Failed to send payment');
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setRecipient('');
    setSent(false);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card text-center"
      >
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
          Your WebRTC payment of ${amount} has been sent successfully.
        </p>

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
            onClick={disconnect}
            className="flex-1 btn-secondary"
          >
            Disconnect
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">WebRTC Payment</h3>
        <p className="text-gray-600">Send payments through secure peer-to-peer connection</p>
      </div>

      {!isConnected ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Not Connected</h4>
          <p className="text-gray-600 mb-6">Connect to a peer to enable WebRTC payments</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={connect}
            disabled={isConnecting}
            className="btn-primary py-3 px-6 disabled:opacity-50"
          >
            {isConnecting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Connecting...
              </div>
            ) : (
              'Connect to Peer'
            )}
          </motion.button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="input-field"
              placeholder="Enter recipient wallet address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field pl-8"
                placeholder="0.00"
                step="0.01"
                min="0.01"
              />
            </div>
          </div>

          <motion.button
            onClick={handleSendPayment}
            disabled={sending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50"
          >
            {sending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Send className="w-5 h-5 mr-2" />
                Send via WebRTC
              </div>
            )}
          </motion.button>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">WebRTC Benefits</h4>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Direct peer-to-peer connection</li>
                  <li>• Enhanced security and privacy</li>
                  <li>• Real-time payment confirmations</li>
                  <li>• No intermediary servers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WebRTCPayment;

