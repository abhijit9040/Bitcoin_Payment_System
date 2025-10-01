import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QrScanner } from 'react-qr-scanner';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const ScanPay = () => {
  const [scanning, setScanning] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txid, setTxid] = useState('');
  const { user, updateBalance } = useAuth();

  const handleScan = async (result) => {
    if (result) {
      try {
        const parsedData = JSON.parse(result);
        setQrData(parsedData);
        setAmount(parsedData.amount || '');
        setScanning(false);
        toast.success('QR code scanned successfully!');
      } catch (error) {
        toast.error('Invalid QR code format');
      }
    }
  };

  const handleError = (error) => {
    console.error('QR scan error:', error);
    toast.error('Failed to scan QR code');
  };

  const handlePayment = async () => {
    if (!qrData || !amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > user.balance) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/pay', {
        to: qrData.address,
        amount: parseFloat(amount)
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

  const resetScan = () => {
    setScanning(false);
    setQrData(null);
    setAmount('');
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

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your payment of ${amount} has been sent successfully.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
            <p className="font-mono text-sm text-gray-900 break-all">{txid}</p>
          </div>

          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetScan}
              className="flex-1 btn-primary"
            >
              Scan Another
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

  if (qrData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="mb-6">
          <button 
            onClick={resetScan}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Scanner
          </button>
        </div>

        <div className="card">
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Details</h2>
            <p className="text-gray-600">Review and confirm your payment</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Recipient</p>
              <p className="font-mono text-sm text-gray-900 break-all">
                {qrData.address}
              </p>
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
                  max={user.balance}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Available balance: ${user.balance?.toFixed(2)}
              </p>
            </div>

            <motion.button
              onClick={handlePayment}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </div>
              ) : (
                'Pay Now'
              )}
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
      className="max-w-2xl mx-auto"
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
            className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Camera className="w-8 h-8 text-blue-600" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Scan & Pay</h1>
          <p className="text-gray-600">Scan a QR code to make a quick payment</p>
        </div>

        {!scanning ? (
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScanning(true)}
              className="btn-primary py-4 px-8 text-lg font-semibold"
            >
              <Camera className="w-6 h-6 mr-3" />
              Start Scanning
            </motion.button>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">How to scan</h4>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Point your camera at a payment QR code</li>
                    <li>• Make sure the QR code is well-lit and in focus</li>
                    <li>• The scanner will automatically detect and process the code</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="relative">
              <div className="aspect-square max-w-sm mx-auto bg-black rounded-lg overflow-hidden">
                <QrScanner
                  onDecode={handleScan}
                  onError={handleError}
                  style={{ width: '100%' }}
                  constraints={{
                    facingMode: 'environment'
                  }}
                />
              </div>
              <div className="absolute top-4 right-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setScanning(false)}
                  className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">Position the QR code within the frame</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setScanning(false)}
                className="btn-secondary"
              >
                Cancel Scanning
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ScanPay;
