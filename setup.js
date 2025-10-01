const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up WebRTC Wallet App...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js version: ${nodeVersion.trim()}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js first.');
  process.exit(1);
}

// Install root dependencies
console.log('\n📦 Installing root dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Root dependencies installed');
} catch (error) {
  console.error('❌ Failed to install root dependencies');
  process.exit(1);
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('cd backend && npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('cd frontend && npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n⚙️  Creating environment file...');
  const envContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/webrtc-wallet
JWT_SECRET=your-super-secret-jwt-key-here-${Math.random().toString(36).substr(2, 9)}
NODE_ENV=development`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment file created');
} else {
  console.log('✅ Environment file already exists');
}

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Make sure MongoDB is running (mongod)');
console.log('2. Run: npm run dev');
console.log('3. Open http://localhost:3000');
console.log('\n🔧 Available commands:');
console.log('- npm run dev (start both frontend and backend)');
console.log('- npm run server (backend only)');
console.log('- npm run client (frontend only)');
console.log('\n📚 Check README.md for detailed instructions');


