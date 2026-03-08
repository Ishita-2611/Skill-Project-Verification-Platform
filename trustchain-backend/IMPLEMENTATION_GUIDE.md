# TrustChain v1.0 Backend Implementation Summary

✅ **Implementation Complete!**

## Project Structure

```
trustchain-backend/
├── src/
│   ├── app.js                          ← Express entry point
│   ├── config/
│   │   ├── db.js                       ← MongoDB connection
│   │   ├── blockchain.js               ← Ethers.js setup
│   │   └── abi.json                    ← Smart contract ABI
│   ├── controllers/
│   │   ├── auth.controller.js          ← Auth logic (register, login)
│   │   ├── project.controller.js       ← Project upload & management
│   │   └── verification.controller.js  ← Verification & peer review
│   ├── models/
│   │   ├── User.js                     ← User schema with auth
│   │   ├── Project.js                  ← Project schema with blockchain refs
│   │   └── Verification.js             ← Verification schema
│   ├── routes/
│   │   ├── auth.routes.js              ← Auth endpoints
│   │   ├── project.routes.js           ← Project endpoints
│   │   └── verification.routes.js      ← Verification endpoints
│   ├── services/
│   │   ├── ipfs.service.js             ← Pinata/IPFS operations
│   │   └── blockchain.service.js       ← Ethers.js operations
│   ├── middleware/
│   │   ├── auth.middleware.js          ← JWT authentication
│   │   ├── upload.middleware.js        ← Multer file handling
│   │   └── error.middleware.js         ← Error handling
│   └── utils/
│       └── response.js                 ← Response utilities
├── .env                                ← Environment variables
├── .env.example                        ← Example environment file
├── package.json                        ← Dependencies & scripts
└── uploads/                            ← Temporary file storage

```

## Database Models

### User Schema
- **username** - Unique username
- **email** - Unique email
- **password** - Hashed with bcrypt (12 rounds)
- **walletAddress** - Optional Ethereum wallet
- **role** - developer | recruiter | reviewer
- **reputationScore** - Default 0
- **skills** - Array of skill strings
- **githubUrl** - Optional GitHub profile
- **bio** - Optional biography
- **avatar** - Optional avatar URL
- **isVerified** - Email verification flag
- **timestamps** - createdAt, updatedAt

### Project Schema
- **userId** - Reference to User (required)
- **title** - Project title (required)
- **description** - Project description (required)
- **githubUrl** - Optional GitHub link
- **projectHash** - SHA-256 hash (unique, required)
- **ipfsHash** - IPFS content hash (required)
- **txHash** - Ethereum transaction hash
- **blockNumber** - Block number on chain
- **skills** - Array of skill strings
- **fileCount** - Number of files uploaded
- **totalSize** - Total file size in bytes
- **status** - pending | uploaded | verified | rejected
- **endorsements** - Endorsement count (default 0)
- **verificationCount** - Peer verification count
- **timestamps** - createdAt, updatedAt

### Verification Schema
- **projectId** - Reference to Project (required)
- **reviewerId** - Reference to User (required)
- **status** - pending | approved | rejected
- **rating** - 1-5 star rating
- **comment** - Reviewer comment
- **skills** - Array of verified skills
- **endorsedBy** - Endorsement count
- **txHash** - Blockchain transaction hash
- **blockNumber** - Block number on chain
- **timestamps** - createdAt, updatedAt

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login and get JWT token |
| GET | `/me` | ✅ | Get current user profile |
| PUT | `/me` | ✅ | Update user profile |

**Register/Login Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "username": "dev1",
    "role": "developer"
  }
}
```

### Project Routes (`/api/projects`)

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/upload` | ✅ | Upload project file → IPFS → Hash → Blockchain |
| GET | `/my` | ✅ | Get all user's projects |
| GET | `/:id` | ❌ | Get single project details |
| GET | `/stats` | ❌ | Get system statistics |
| PUT | `/:id/status` | ✅ | Update project status (reviewer/recruiter only) |
| DELETE | `/:id` | ✅ | Delete project |

**Upload Project Request:**
```bash
curl -X POST http://localhost:3000/api/projects/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@project.zip" \
  -F "title=My DApp" \
  -F "description=A blockchain project" \
  -F 'skills=["solidity","react"]' \
  -F "githubUrl=https://github.com/user/repo"
```

**Upload Response:**
```json
{
  "success": true,
  "message": "Project uploaded and verified on blockchain",
  "data": {
    "projectId": "...",
    "projectHash": "abc123...",
    "ipfsHash": "QmXxxx...",
    "txHash": "0x...",
    "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmXxxx..."
  }
}
```

### Verification Routes (`/api/verify`)

| Method | Endpoint | Protected | Role Required | Description |
|--------|----------|-----------|---------------|-------------|
| POST | `/:projectId` | ✅ | reviewer/recruiter | Submit project verification |
| GET | `/:projectId` | ❌ | - | Get all verifications for project |
| GET | `/hash/:hash` | ❌ | - | Verify hash on blockchain |
| GET | `/stats/reviewer` | ✅ | - | Get reviewer statistics |
| GET | `/stats/all` | ❌ | - | Get system verification stats |

## Environment Variables

Create `.env` file based on `.env.example`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/trustchain
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET=your_pinata_secret
INFURA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_ID
CONTRACT_ADDRESS=0x...deployed_contract_address
PRIVATE_KEY=your_wallet_private_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

⚠️ **IMPORTANT:** Never commit `.env` to version control!

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy the example file and edit with your values
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start MongoDB (if not running)
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or using local MongoDB
mongod
```

### 4. Start Development Server
```bash
npm run dev
```

Server will start on `http://localhost:3000`

### 5. Verify Health
```bash
curl http://localhost:3000/health
```

## Testing with cURL

### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dev1",
    "email": "dev@test.com",
    "password": "Pass1234!",
    "role": "developer"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@test.com",
    "password": "Pass1234!"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Upload Project
```bash
curl -X POST http://localhost:3000/api/projects/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test.zip" \
  -F "title=Test Project" \
  -F "description=A test project" \
  -F 'skills=["javascript","react"]'
```

### Get User's Projects
```bash
curl -X GET http://localhost:3000/api/projects/my \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Project Stats
```bash
curl http://localhost:3000/api/projects/stats
```

## Key Features

✅ **JWT Authentication** - Secure token-based authentication
✅ **Password Hashing** - Bcrypt with 12 rounds
✅ **IPFS Integration** - Pinata SDK for file storage
✅ **Blockchain Integration** - Ethers.js v6 for smart contracts
✅ **MongoDB Persistence** - Complete NoSQL database schema
✅ **File Upload Validation** - Multer with size/type checks
✅ **Error Handling** - Comprehensive error middleware
✅ **CORS Enabled** - Cross-origin requests supported
✅ **Security Headers** - Helmet.js security middleware
✅ **Rate Limiting** - Express rate limit (15 min, 100 requests)
✅ **Role-Based Access** - developer/recruiter/reviewer roles
✅ **Peer Verification** - Project verification system

## Architecture Highlights

### 1. **Modular Structure**
   - Separation of concerns (controllers, services, models)
   - Easy to test and maintain
   - Clear dependency flow

### 2. **Service Layer**
   - IPFS service handles file uploads to Pinata
   - Blockchain service handles smart contract interactions
   - Clean abstraction from controllers

### 3. **Middleware Stack**
   - Security (Helmet, CORS, Rate Limiting)
   - Authentication (JWT verification)
   - File handling (Multer with validation)
   - Error handling (Centralized error middleware)

### 4. **Database Integration**
   - Mongoose ODM for type safety
   - Pre-save hooks for password hashing
   - Reference-based relationships between models

## Next Steps

1. **Deploy Smart Contract**
   - Create Solidity smart contract
   - Deploy to Sepolia testnet
   - Update CONTRACT_ADDRESS in .env

2. **Connect Pinata Account**
   - Get API keys from pinata.cloud
   - Add to PINATA_API_KEY and PINATA_SECRET in .env
   - Test IPFS connection

3. **Setup MetaMask**
   - Create testnet wallet
   - Get testnet ETH from faucet
   - Add PRIVATE_KEY to .env

4. **Frontend Development**
   - Create React frontend
   - Integrate authentication
   - Build project upload UI
   - Add verification dashboard

5. **Testing & Deployment**
   - Write unit tests
   - Setup CI/CD pipeline
   - Deploy to production server
   - Setup monitoring

## Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running. Start with `mongod` or Docker.

### IPFS Connection Warning
```
⚠️ IPFS upload failed: ...
```
**Solution:** Check Pinata credentials in .env. Project still stores locally.

### Blockchain Initialization Warning
```
⚠️ Blockchain initialization warning: ...
```
**Solution:** Make sure CONTRACT_ADDRESS and PRIVATE_KEY are valid in .env.

### JWT Token Expired
```
Error: Token invalid or expired
```
**Solution:** Get a new token by logging in again.

## Dependencies Used

- **express** ^4.18 - Web framework
- **mongoose** ^7.x - MongoDB ODM
- **ethers** ^6.x - Ethereum library
- **@pinata/sdk** ^2.x - IPFS provider
- **jsonwebtoken** ^9.x - JWT authentication
- **bcryptjs** ^2.x - Password hashing
- **multer** ^1.x - File upload handling
- **dotenv** ^16.x - Environment variables
- **cors** ^2.x - Cross-origin support
- **helmet** ^7.x - Security headers
- **morgan** ^1.x - HTTP logging
- **express-rate-limit** ^8.x - Rate limiting
- **express-validator** ^7.x - Input validation

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [Ethers.js v6](https://docs.ethers.org/v6/)
- [Pinata Documentation](https://docs.pinata.cloud/)
- [JSON Web Tokens](https://jwt.io/)
- [Sepolia Testnet Faucet](https://sepoliafaucet.com/)

---

**Status:** ✅ Backend implementation complete and ready for testing!
