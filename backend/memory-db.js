// Simple in-memory database for development
// This replaces MongoDB for quick testing

let users = [];
let transactions = [];

// User operations
const createUser = async (userData) => {
  const user = {
    _id: Date.now().toString(),
    ...userData,
    createdAt: new Date()
  };
  users.push(user);
  return user;
};

const findUser = async (query) => {
  if (query._id) {
    return users.find(user => user._id === query._id);
  }
  if (query.email) {
    return users.find(user => user.email === query.email);
  }
  if (query.username) {
    return users.find(user => user.username === query.username);
  }
  if (query.$or) {
    return users.find(user => 
      query.$or.some(condition => 
        Object.keys(condition).some(key => user[key] === condition[key])
      )
    );
  }
  return null;
};

const findUserById = async (id) => {
  return users.find(user => user._id === id);
};

const updateUser = async (id, updateData) => {
  const userIndex = users.findIndex(user => user._id === id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updateData };
    return users[userIndex];
  }
  return null;
};

// Transaction operations
const createTransaction = async (transactionData) => {
  const transaction = {
    _id: Date.now().toString(),
    ...transactionData,
    timestamp: new Date()
  };
  transactions.push(transaction);
  return transaction;
};

const findTransactions = async (query) => {
  if (query.$or) {
    return transactions.filter(transaction =>
      query.$or.some(condition => {
        if (condition.from) return transaction.from === condition.from;
        if (condition.to) return transaction.to === condition.to;
        return false;
      })
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
  return transactions;
};

// Clear all data (for testing)
const clearAll = () => {
  users = [];
  transactions = [];
};

module.exports = {
  createUser,
  findUser,
  findUserById,
  updateUser,
  createTransaction,
  findTransactions,
  clearAll
};


