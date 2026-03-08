# 🚀 TrustChain v1.0 Backend - Quick Start Guide

## What's Implemented

Complete Node.js/Express backend with:
- ✅ User authentication (JWT + bcrypt)
- ✅ MongoDB database integration
- ✅ IPFS file upload (Pinata)
- ✅ Ethereum blockchain integration (Ethers.js v6)
- ✅ Project upload & verification system
- ✅ Peer review verification
- ✅ Role-based access control
- ✅ Complete REST API with 15+ endpoints

## Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or Docker)
- **Pinata account** (for IPFS)
- **Ethereum wallet** (for blockchain)
- **Infura account** (for RPC endpoint)

## Setup (5 minutes)

### 1. Clone & Install
```bash
cd trustchain-backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/trustchain
JWT_SECRET=your_secret_key_change_this
PINATA_API_KEY=your_pinata_key
PINATA_SECRET=your_pinata_secret
INFURA_URL=https://sepolia.infura.io/v3/YOUR_ID
CONTRACT_ADDRESS=0x...
PRIVATE_KEY=your_wallet_key
```

### 3. Start MongoDB (if not running)
```bash
# Option A: Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Option B: Local MongoDB
mongod
```

### 4. Start Server
```bash
npm run dev
```

Output should show:
```
✅ MongoDB Connected: localhost
✅ Blockchain service initialized
🚀 Server running on port 3000
```

### 5. Test Health
```bash
curl http://localhost:3000/health
```

## API Overview

| Endpoint | Method | Protected | Purpose |
|----------|--------|-----------|---------|
| `/api/auth/register` | POST | ❌ | Create account |
| `/api/auth/login` | POST | ❌ | Get JWT token |
| `/api/auth/me` | GET | ✅ | Get profile |
| `/api/projects/upload` | POST | ✅ | Upload to IPFS + blockchain |
| `/api/projects/my` | GET | ✅ | List my projects |
| `/api/projects/:id` | GET | ❌ | View project |
| `/api/verify/:projectId` | POST | ✅ | Verify project |
| `/api/verify/:projectId` | GET | ❌ | See verifications |

## Quick Test

```bash
# 1. Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"dev1","email":"dev@test.com","password":"Pass1234!","role":"developer"}'

# 2. Login (copy the token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@test.com","password":"Pass1234!"}'

# 3. Upload project
curl -X POST http://localhost:3000/api/projects/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.zip" \
  -F "title=My Project" \
  -F "description=Test project"

# 4. View projects
curl http://localhost:3000/api/projects/stats
```

## File Structure

```
src/
├── app.js                  # Express server entry point
├── config/                 # Database & blockchain config
├── controllers/            # Business logic (auth, projects, verify)
├── middleware/            # Auth, file upload, error handling
├── models/                # MongoDB schemas (User, Project, Verification)
├── routes/                # API endpoints
├── services/              # IPFS and blockchain services
└── utils/                 # Helper utilities
```

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection | `mongodb://localhost:27017/trustchain` |
| `JWT_SECRET` | Token signing key | Any random string (32+ chars recommended) |
| `JWT_EXPIRE` | Token duration | `7d` |
| `PINATA_API_KEY` | IPFS provider | From pinata.cloud dashboard |
| `PINATA_SECRET` | IPFS provider secret | From pinata.cloud dashboard |
| `INFURA_URL` | Ethereum RPC | `https://sepolia.infura.io/v3/YOUR_ID` |
| `CONTRACT_ADDRESS` | Smart contract address | `0x...` |
| `PRIVATE_KEY` | Wallet private key | `0x...` (NEVER share!) |
| `NODE_ENV` | Environment | `development` or `production` |

## Troubleshooting

### MongoDB Connection Failed
```
❌ MongoDB Error: connect ECONNREFUSED
```
→ Start MongoDB with `mongod` or Docker

### IPFS Upload Failed
```
⚠️ IPFS upload failed
```
→ Check Pinata credentials in .env (project still saves locally)

### Blockchain Warning
```
⚠️ Blockchain initialization warning
```
→ Check CONTRACT_ADDRESS and PRIVATE_KEY are valid

### Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
→ Change PORT in .env or kill process using port 3000

## Production Deployment

Before production:
1. Set `NODE_ENV=production` in .env
2. Use strong `JWT_SECRET` (64+ character random string)
3. Setup MongoDB Atlas (cloud) instead of local
4. Use environment-based variables (don't hardcode)
5. Setup CI/CD pipeline
6. Enable monitoring & logging

## Scripts

```bash
npm run dev      # Start with auto-reload (nodemon)
npm start        # Start production server
npm test         # Run tests (when configured)
```

## Next Steps

1. **Deploy Smart Contract** - Create and deploy your Solidity contract
2. **Setup Frontend** - Create React UI to interact with this API
3. **Add Testing** - Write Jest tests for endpoints
4. **Production** - Deploy to AWS, Heroku, or VPS

## Documentation

📖 Full documentation available in `IMPLEMENTATION_GUIDE.md`:
- Complete API reference
- Database schemas
- Authentication flow
- Error handling
- Testing examples

## Support

For issues or questions:
1. Check error messages in terminal
2. Review IMPLEMENTATION_GUIDE.md
3. Verify .env configuration
4. Check database/blockchain connections

---

**Happy Coding! 🎉**

Built with ❤️ using Express, MongoDB, IPFS, and Ethereum
