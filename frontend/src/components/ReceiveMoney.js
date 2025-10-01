import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, QrCode, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const ReceiveMoney = () => {
  const [amount, setAmount] = useState('');
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  const generateQR = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/generate-qr', { amount: parseFloat(amount) });
      setQrData(response.data);
      toast.success('QR code generated!');
    } catch (error) {
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(user.address);
      setCopied(true);
      toast.success('Address copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy address');
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `payment-qr-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Code Generation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <QrCode className="w-8 h-8 text-green-600" />
            </motion.div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Generate QR Code</h2>
            <p className="text-gray-600">Create a QR code for receiving payments</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (Optional)
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
              <p className="text-sm text-gray-500 mt-1">
                Leave empty for any amount
              </p>
            </div>

            <motion.button
              onClick={generateQR}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary py-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <QrCode className="w-5 h-5 mr-2" />
                  Generate QR Code
                </div>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* QR Code Display */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your QR Code</h3>
            
            {qrData ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="space-y-4"
              >
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 inline-block">
                  <QRCode
                    id="qr-code"
                    value={JSON.stringify(qrData)}
                    size={200}
                    level="M"
                    includeMargin={true}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    {amount ? `Amount: $${amount}` : 'Any amount'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Share this QR code to receive payments
                  </p>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadQR}
                    className="flex-1 btn-secondary py-2 text-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <div className="py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500">Generate a QR code to start receiving payments</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Wallet Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card mt-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Wallet Address</h3>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="font-mono text-sm text-gray-900 break-all">
                {user.address}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyAddress}
              className="ml-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-xs font-bold text-blue-600">i</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900">How to receive payments</h4>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Share your wallet address or QR code</li>
                <li>• Recipients can scan the QR code to pay you</li>
                <li>• Payments will appear in your balance instantly</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReceiveMoney;
