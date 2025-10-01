# WebRTC Wallet App - Deployment Guide

This guide covers deploying the WebRTC Wallet App to production environments.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended for Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel

# Deploy backend
cd ../backend
vercel
```

### Option 2: Netlify + Railway
```bash
# Frontend to Netlify
cd frontend
npm run build
# Upload dist folder to Netlify

# Backend to Railway
cd ../backend
# Connect GitHub repo to Railway
```

### Option 3: Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📋 Pre-Deployment Checklist

### Backend Requirements
- [ ] MongoDB database (Atlas or self-hosted)
- [ ] Environment variables configured
- [ ] SSL certificate
- [ ] Domain name
- [ ] Rate limiting configured
- [ ] Security headers enabled

### Frontend Requirements
- [ ] Production build created
- [ ] Environment variables set
- [ ] PWA manifest configured
- [ ] Service worker registered
- [ ] HTTPS enabled

## 🔧 Environment Configuration

### Backend Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/webrtc-wallet
JWT_SECRET=your-super-secure-jwt-secret-key
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

## 🐳 Docker Deployment

### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/webrtc-wallet
      - JWT_SECRET=your-jwt-secret
    ports:
      - "5000:5000"
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

## ☁️ Cloud Deployment

### AWS Deployment
1. **EC2 Instance Setup**
   ```bash
   # Launch EC2 instance (Ubuntu 20.04)
   # Install Node.js, MongoDB, Nginx
   sudo apt update
   sudo apt install nodejs npm mongodb nginx
   ```

2. **Application Deployment**
   ```bash
   # Clone repository
   git clone <your-repo>
   cd webrtc-wallet-app
   
   # Install dependencies
   npm run install-all
   
   # Build frontend
   cd frontend && npm run build
   
   # Start backend with PM2
   cd ../backend
   npm install -g pm2
   pm2 start server.js --name "webrtc-wallet-api"
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           root /path/to/frontend/build;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Google Cloud Platform
1. **App Engine Deployment**
   ```yaml
   # app.yaml (Backend)
   runtime: nodejs18
   env: standard
   instance_class: F2
   automatic_scaling:
     min_instances: 1
     max_instances: 10
   env_variables:
     NODE_ENV: production
     MONGODB_URI: "mongodb+srv://..."
   ```

2. **Firebase Hosting (Frontend)**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

## 🔒 Security Considerations

### SSL/TLS Configuration
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
}
```

### Security Headers
```javascript
// Backend security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### Database Security
- Enable MongoDB authentication
- Use connection string with credentials
- Enable SSL for database connections
- Regular backups
- Monitor for suspicious activity

## 📊 Monitoring & Analytics

### Application Monitoring
```javascript
// Add to backend
const express = require('express');
const prometheus = require('express-prometheus-middleware');

app.use(prometheus({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
}));
```

### Error Tracking
```javascript
// Sentry integration
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });
app.use(Sentry.requestHandler());
```

### Logging
```javascript
// Winston logger
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🚀 Performance Optimization

### Frontend Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize images
- Enable browser caching

### Backend Optimization
- Database indexing
- Connection pooling
- Caching with Redis
- Load balancing
- API rate limiting

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm run install-all
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Your deployment commands
```

## 📱 Mobile App Deployment

### PWA Deployment
- Ensure HTTPS is enabled
- Configure service worker
- Test offline functionality
- Validate manifest.json
- Test on various devices

### App Store Deployment (if using Capacitor)
```bash
npm install -g @capacitor/cli
npx cap add ios
npx cap add android
npx cap build
npx cap open ios
npx cap open android
```

## 🆘 Troubleshooting

### Common Issues
1. **CORS Errors**: Check CORS configuration in backend
2. **WebRTC Issues**: Ensure HTTPS and proper STUN/TURN servers
3. **Database Connection**: Verify MongoDB URI and credentials
4. **Build Failures**: Check Node.js version and dependencies

### Debug Commands
```bash
# Check application status
pm2 status
pm2 logs webrtc-wallet-api

# Database connection test
mongo "mongodb://username:password@host:port/database"

# SSL certificate check
openssl s_client -connect yourdomain.com:443
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Load balancer configuration
- Database sharding
- Microservices architecture
- Container orchestration (Kubernetes)

### Vertical Scaling
- Increase server resources
- Database optimization
- Caching strategies
- CDN implementation

## 🔧 Maintenance

### Regular Tasks
- Security updates
- Database backups
- Performance monitoring
- Log rotation
- SSL certificate renewal

### Monitoring Alerts
- Server downtime
- High error rates
- Database performance
- Memory usage
- Disk space

This deployment guide provides comprehensive instructions for deploying the WebRTC Wallet App to various environments. Choose the deployment method that best fits your infrastructure and requirements.

