# 🚀 Backend Setup Status & Testing Guide

## ✅ What Has Been Fixed

1. **Removed deprecated `assert` syntax** in blockchain.service.js
   - ❌ Before: `import ABI from 'file.json' assert { type: 'json' }`
   - ✅ After: Using `fs.readFileSync()` for compatibility

2. **Removed deprecated MongoDB options**
   - ❌ Before: `useNewUrlParser: true, useUnifiedTopology: true`
   - ✅ After: Modern Mongoose connection (v9.x compatible)

3. **Updated .env with working configuration**
   - MongoDB URI: `mongodb://127.0.0.1:27017/trustchain`
   - JWT_SECRET: Generated
   - All variables configured

## 🎯 Current Status

| Component | Status | Details |
|-----------|--------|---------|
| Code | ✅ Ready | All source files created and fixed |
| Dependencies | ✅ Installed | npm install completed |
| Configuration | ✅ Done | .env configured with valid values |
| MongoDB | ⏳ Starting | Docker image pulling/initializing |
| Server | 🔜 Ready | Waiting for MongoDB to be accessible |

## 📋 Complete Checklist for Full Functionality

### Phase 1: Database Setup (Currently in progress)
- [ ] MongoDB running on `127.0.0.1:27017`
  ```bash
  # Option A: Docker (Recommended)
  docker run -d -p 27017:27017 --name trustchain-db mongo:latest
  
  # Option B: Local MongoDB
  mongod
  ```

- [ ] Verify connection:
  ```bash
  # Once MongoDB is running, the server will auto-connect
  npm run dev
  ```

### Phase 2: Start Express Server
```bash
cd trustchain-backend
npm run dev
```

**Expected output:**
```
✅ MongoDB Connected: 127.0.0.1
✅ Blockchain service initialized
🚀 Server running on port 3000
📍 Environment: development
```

### Phase 3: Test API Endpoints

**Test 1: Health Check**
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-03-07T...",
  "environment": "development"
}
```

**Test 2: Register User**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test1234!",
    "role": "developer"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "username": "testuser",
    "role": "developer"
  }
}
```

**Test 3: Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!"
  }'
```

**Test 4: Get Current User** (using token from login)
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Phase 4: Optional - For Full IPFS/Blockchain Testing

To enable file uploads and blockchain features:

1. **Create Pinata Account**
   - Sign up at https://pinata.cloud
   - Get API Key and Secret
   - Update `.env`:
     ```
     PINATA_API_KEY=your_api_key
     PINATA_SECRET=your_secret
     ```

2. **Setup Ethereum Wallet**
   - Create MetaMask wallet or use existing
   - Get Sepolia testnet ETH from faucet
   - Update `.env`:
     ```
     PRIVATE_KEY=0xyour_private_key
     ```

3. **Get Infura RPC**
   - Sign up at https://infura.io
   - Create project on Sepolia testnet
   - Update `.env`:
     ```
     INFURA_URL=https://sepolia.infura.io/v3/YOUR_ID
     ```

4. **Deploy Smart Contract**
   - Create Solidity smart contract
   - Deploy to Sepolia testnet
   - Update `.env`:
     ```
     CONTRACT_ADDRESS=0x...
     ```

## 🔍 Troubleshooting

### MongoDB Connection Issues

**Problem:** `ECONNREFUSED 127.0.0.1:27017`
```
Solution: 
1. Check if MongoDB is running: docker ps
2. Start MongoDB: docker run -d -p 27017:27017 --name trustchain-db mongo:latest
3. Wait 10-15 seconds for initialization
4. Try again: npm run dev
```

### Port Already in Use

**Problem:** `EADDRINUSE :::3000`
```bash
# Kill process using port 3000
lsof -i :3000
kill -9 <PID>

# Or change PORT in .env
PORT=3001
```

### Module/Import Errors

**Problem:** `Cannot find module` or syntax errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear nodemon cache
pkill -f nodemon
npm run dev
```

## 📊 Services Architecture

```
Client (React/Postman)
    ↓
Express Server (Port 3000)
    ├─→ MongoDB (Port 27017) - User, Project, Verification data
    ├─→ Pinata/IPFS - File storage (optional)
    └─→ Ethereum Sepolia - Blockchain verification (optional)
```

## 🎯 Next Steps After Server is Running

1. ✅ Verify health endpoint works
2. ✅ Test auth (register/login)
3. ✅ Test protected routes (get user profile)
4. 📱 Build frontend (React)
5. 🔗 Deploy smart contract
6. 📦 Test file uploads to IPFS
7. ⛓️ Test blockchain interactions

## 📝 Quick Start Command (Once MongoDB is ready)

```bash
cd trustchain-backend && npm run dev
```

Then in another terminal:
```bash
curl http://localhost:3000/health
```

---

**Status**: 🟡 Waiting for MongoDB to finish initialization  
**ETA**: 5-10 more seconds, then server will be fully operational  

Once you see:
```
✅ MongoDB Connected: 127.0.0.1
🚀 Server running on port 3000
```

Your backend is **fully functional!** 🎉
