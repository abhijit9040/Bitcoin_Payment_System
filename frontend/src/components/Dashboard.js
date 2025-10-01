import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft,
  QrCode,
  Send,
  Download,
  Video
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/api/transactions');
      setTransactions(response.data);
    } catch (error) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (transaction, userAddress) => {
    if (transaction.from === userAddress) {
      return <ArrowUpRight className="w-5 h-5 text-red-500" />;
    } else {
      return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
    }
  };

  const getTransactionAmount = (transaction, userAddress) => {
    if (transaction.from === userAddress) {
      return `-$${transaction.amount.toFixed(2)}`;
    } else {
      return `+$${transaction.amount.toFixed(2)}`;
    }
  };

  const getTransactionColor = (transaction, userAddress) => {
    if (transaction.from === userAddress) {
      return 'text-red-600';
    } else {
      return 'text-green-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-primary-100">Manage your digital wallet with ease</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-right"
          >
            <p className="text-primary-100 text-sm">Total Balance</p>
            <p className="text-4xl font-bold">$1,000.00</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link to="/send" className="block">
            <div className="card hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Send Money</h3>
                  <p className="text-sm text-gray-500">Transfer to anyone</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link to="/receive" className="block">
            <div className="card hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Receive Money</h3>
                  <p className="text-sm text-gray-500">Generate QR code</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link to="/scan" className="block">
            <div className="card hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Scan & Pay</h3>
                  <p className="text-sm text-gray-500">Quick payments</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link to="/webrtc" className="block">
            <div className="card hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Video className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">WebRTC</h3>
                  <p className="text-sm text-gray-500">P2P payments</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-500">All time</span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full shimmer"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded shimmer mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 shimmer"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16 shimmer"></div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingDown className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
            <p className="text-gray-500">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction, index) => (
              <motion.div
                key={transaction._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getTransactionIcon(transaction, 'WALLET_123')}
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.from === 'WALLET_123' ? 'Sent' : 'Received'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(transaction.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getTransactionColor(transaction, 'WALLET_123')}`}>
                    {getTransactionAmount(transaction, 'WALLET_123')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.txid.slice(0, 8)}...
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
