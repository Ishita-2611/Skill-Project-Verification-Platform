# TrustChain v1.0 - Backend Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                    (Frontend - React/Web3)                      │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ HTTP/REST
             │
┌────────────▼────────────────────────────────────────────────────┐
│                    EXPRESS.JS API SERVER                        │
│  https://localhost:3000                                         │
├─────────────────────────────────────────────────────────────────┤
│                    MIDDLEWARE STACK                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ • Helmet (Security Headers)                              │  │
│  │ • CORS (Cross-Origin Requests)                           │  │
│  │ • Rate Limiting (100 req/15min)                          │  │
│  │ • Body Parser (JSON/URL-encoded)                         │  │
│  │ • Morgan (HTTP Logging)                                  │  │
│  │ • JWT Authentication                                     │  │
│  │ • Multer (File Upload)                                   │  │
│  │ • Error Handler                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                      ROUTE HANDLERS                             │
│  ┌──────────────┬──────────────┬──────────────────────────┐    │
│  │              │              │                          │    │
│  ▼              ▼              ▼                          ▼    │
│ /api/auth   /api/projects  /api/verify              /health    │
│  │              │              │                          │    │
│  ├─────────┬────┴─┬────────┬───┴──────┬────────────┬────┤    │
│  │ register│upload│ my     │verify    │blockchain │stats│    │
│  │ login   │stats │get/:id │  hash    │verification│    │    │
│  │ me      │state │       │  project │  stats      │    │    │
│  │ update  │delete│       │          │             │    │    │
│  └─────────┴──────┴────────┴──────────┴─────────────┴────┘    │
├─────────────────────────────────────────────────────────────────┤
│                    CONTROLLER LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • AuthController (register, login, profile)             │   │
│  │ • ProjectController (upload, retrieve, status)          │   │
│  │ • VerificationController (verify, review, stats)        │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                    SERVICE LAYER                                │
│  ┌─────────────────────────┬─────────────────────────────┐     │
│  │   IPFS Service          │   Blockchain Service        │     │
│  │ ┌─────────────────────┐ │ ┌───────────────────────┐   │     │
│  │ │ Pinata SDK          │ │ │ Ethers.js v6          │   │     │
│  │ │ • uploadToIPFS()    │ │ │ • initBlockchain()    │   │     │
│  │ │ • uploadJSON()      │ │ │ • storeProjectHash()  │   │     │
│  │ │ • generateHash()    │ │ │ • verifyHash()        │   │     │
│  │ │ • testConnection()  │ │ │ • getReputation()     │   │     │
│  │ └─────────────────────┘ │ └───────────────────────┘   │     │
│  └─────────────────────────┴─────────────────────────────┘     │
├─────────────────────────────────────────────────────────────────┤
│                    DATA ACCESS LAYER                            │
│  ┌──────────────┬──────────────┬──────────────────────────┐    │
│  │              │              │                          │    │
│  ▼              ▼              ▼                          │    │
│ User Model  Project Model  Verification Model             │    │
│  │              │              │                          │    │
│  ├─ username    ├─ userId      ├─ projectId             │    │
│  ├─ email       ├─ title       ├─ reviewerId            │    │
│  ├─ password    ├─ ipfsHash    ├─ rating                │    │
│  ├─ wallet      ├─ txHash      ├─ comment               │    │
│  ├─ role        ├─ status      ├─ status                │    │
│  ├─ reputation  ├─ skills      ├─ txHash                │    │
│  └─ verified    └─ endorsements└─ blockNumber           │    │
└─────────────────────────────────────────────────────────────────┘
             │                        │
             │                        │
      ┌──────▼────────────┐    ┌──────▼────────────┐
      │   MONGODB         │    │  IPFS / PINATA    │
      │                   │    │                    │
      │ • Users           │    │ • File Storage     │
      │ • Projects        │    │ • Metadata         │
      │ • Verifications   │    │ • Content Hash     │
      └────────────────────┘    └──────┬─────────────┘
                                       │
                                ┌──────▼────────────┐
                                │  ETHEREUM SEPOLIA │
                                │  TESTNET          │
                                │                    │
                                │ • Smart Contracts  │
                                │ • Hash Storage     │
                                │ • Reputation      │
                                │ • Transactions    │
                                └────────────────────┘
```

## Data Flow Diagram

### Project Upload Flow

```
1. CLIENT
   ├─ POST /api/projects/upload
   ├─ Headers: Authorization: Bearer JWT_TOKEN
   ├─ Body: FormData
   │  ├─ file (zip/pdf)
   │  ├─ title
   │  ├─ description
   │  ├─ skills
   │  └─ githubUrl
   └─> SERVER

2. SERVER - PROJECT CONTROLLER
   ├─ Authenticate user (JWT)
   ├─ Validate input
   └─> IPFS SERVICE

3. IPFS SERVICE
   ├─ Upload file to Pinata
   ├─ Generate IPFS hash
   ├─ Generate project hash (SHA-256)
   └─> BLOCKCHAIN SERVICE

4. BLOCKCHAIN SERVICE
   ├─ Initialize Ethers.js
   ├─ Store hash on Sepolia testnet
   ├─ Get transaction receipt
   └─> MONGODB

5. MONGODB
   ├─ Store project record
   ├─ Link blockchain references
   └─> RESPONSE

6. RESPONSE TO CLIENT
   ├─ projectId
   ├─ projectHash
   ├─ ipfsHash
   ├─ txHash (Ethereum)
   └─ ipfsUrl (gateway link)
```

### Verification Flow

```
1. REVIEWER
   ├─ POST /api/verify/:projectId
   ├─ Headers: Bearer TOKEN, Role: reviewer
   ├─ Body: { rating, comment, skills }
   └─> SERVER

2. SERVER - VERIFICATION CONTROLLER
   ├─ Authenticate reviewer
   ├─ Check authorization (role)
   ├─ Verify project exists
   ├─ Check no duplicate verification
   └─> CREATE VERIFICATION

3. MONGODB
   ├─ Create verification record
   ├─ Update project verification count
   └─> RESPONSE

4. RESPONSE
   ├─ Verification ID
   ├─ Status: approved
   ├─ Rating: 5/5
   └─ Timestamp

5. USER DASHBOARD
   ├─ Display verification
   ├─ Show reviewer details
   ├─ Update project status
   └─ Calculate reputation
```

## Authentication Flow

```
1. REGISTER
   ├─ POST /api/auth/register
   ├─ Body: { username, email, password, role }
   └─> AUTH CONTROLLER
       ├─ Hash password (bcrypt)
       ├─ Save to MongoDB
       ├─ Generate JWT
       └─ Return token

2. LOGIN
   ├─ POST /api/auth/login
   ├─ Body: { email, password }
   └─> AUTH CONTROLLER
       ├─ Find user
       ├─ Verify password
       ├─ Generate JWT
       └─> Return token
           ├─ userId
           ├─ ExpiresIn: 7 days
           └─ Algorithm: HS256

3. PROTECTED REQUEST
   ├─ GET /api/auth/me
   ├─ Headers: Authorization: Bearer TOKEN
   └─> AUTH MIDDLEWARE
       ├─ Verify JWT signature
       ├─ Decode payload
       ├─ Fetch user from DB
       └─> ATTACH TO req.user
           └─> CONTROLLER
               └─> ACCESS GRANTED
```

## Role-Based Access Control

```
┌────────────────────────────────────────────────────┐
│              USER ROLES & PERMISSIONS              │
├────────────────────────────────────────────────────┤
│                                                    │
│  DEVELOPER                                         │
│  ├─ Upload projects                               │
│  ├─ View own projects                             │
│  ├─ Receive verifications                         │
│  ├─ Earn reputation                               │
│  └─ View public projects                          │
│                                                    │
│  REVIEWER                                          │
│  ├─ Upload projects (as developer)                │
│  ├─ Verify projects (peer review)                 │
│  ├─ Rate projects (1-5 stars)                     │
│  ├─ Comment on projects                           │
│  ├─ See verification stats                        │
│  └─ Earn reviewer reputation                      │
│                                                    │
│  RECRUITER                                         │
│  ├─ Upload portfolios                             │
│  ├─ View verified projects                        │
│  ├─ Verify skills                                 │
│  ├─ Leave endorsements                            │
│  ├─ Access reputation data                        │
│  └─ Generate reports                              │
│                                                    │
└────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────┐
│         SECURITY LAYERS                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 1. TRANSPORT LAYER                                 │
│    ├─ HTTPS/TLS (production)                       │
│    └─ Encrypted connections                        │
│                                                     │
│ 2. REQUEST LAYER                                   │
│    ├─ Helmet: Security headers                     │
│    ├─ CORS: Cross-origin control                  │
│    ├─ Rate Limiting: DDoS protection              │
│    └─ Input Validation: XSS prevention            │
│                                                     │
│ 3. AUTHENTICATION LAYER                            │
│    ├─ JWT: Token-based auth                       │
│    ├─ Bcrypt: Password hashing (12 rounds)        │
│    ├─ Token Expiry: 7 days                        │
│    └─ Secure Claims: User ID only                 │
│                                                     │
│ 4. AUTHORIZATION LAYER                             │
│    ├─ Role-Based Access Control                    │
│    ├─ Route Protection                             │
│    └─ Permission Enforcement                       │
│                                                     │
│ 5. DATA LAYER                                      │
│    ├─ MongoDB: Database security                   │
│    ├─ Unique Constraints: Email, wallet            │
│    ├─ Validation Rules: Required fields            │
│    └─ Timestamps: Audit trail                      │
│                                                     │
│ 6. BLOCKCHAIN LAYER                                │
│    ├─ Private Key: Secure storage                  │
│    ├─ Smart Contract: Immutable records            │
│    ├─ Hash Verification: Integrity check           │
│    └─ Txn Confirmation: Block verification        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌──────────────────────────────────────────┐
│         TECHNOLOGY STACK                 │
├──────────────────────────────────────────┤
│                                          │
│ RUNTIME:                                 │
│ └─ Node.js ≥ 18                         │
│                                          │
│ WEB FRAMEWORK:                           │
│ └─ Express.js ^4.18                     │
│    ├─ HTTP server                       │
│    ├─ Routing                           │
│    ├─ Middleware                        │
│    └─ Error handling                    │
│                                          │
│ DATABASE:                                │
│ ├─ MongoDB                              │
│ └─ Mongoose ^7.x ODM                    │
│    ├─ Schema validation                 │
│    ├─ Relationships                     │
│    └─ Query builder                     │
│                                          │
│ AUTHENTICATION:                          │
│ ├─ JWT (jsonwebtoken ^9.x)              │
│ └─ Bcryptjs ^2.x                        │
│    ├─ Password hashing                  │
│    ├─ Comparison                        │
│    └─ Salt rounds: 12                   │
│                                          │
│ FILE UPLOAD:                             │
│ └─ Multer ^1.x                          │
│    ├─ Disk storage                      │
│    ├─ Type validation                   │
│    └─ Size limits (10MB)                │
│                                          │
│ BLOCKCHAIN:                              │
│ └─ Ethers.js ^6.x                       │
│    ├─ Sepolia RPC                       │
│    ├─ Contract interaction              │
│    ├─ Wallet management                 │
│    └─ Transaction handling              │
│                                          │
│ IPFS:                                    │
│ └─ Pinata SDK ^2.x                      │
│    ├─ File upload                       │
│    ├─ Metadata storage                  │
│    └─ IPFS pinning                      │
│                                          │
│ SECURITY:                                │
│ ├─ Helmet ^7.x (security headers)       │
│ ├─ CORS ^2.x (cross-origin)             │
│ └─ express-rate-limit ^8.x              │
│                                          │
│ UTILITIES:                               │
│ ├─ Morgan ^1.x (logging)                │
│ ├─ Dotenv ^16.x (env vars)              │
│ ├─ crypto (Node.js native)              │
│ └─ nodemon (dev auto-reload)            │
│                                          │
└──────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│         PRODUCTION DEPLOYMENT                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  CLIENT (React/Web3)                               │
│       │                                             │
│       │ HTTPS                                       │
│       ▼                                             │
│  ┌─────────────────────────────────────┐          │
│  │      REVERSE PROXY / LOAD            │          │
│  │      BALANCER (Nginx/AWS LB)         │          │
│  └─────────────────────────────────────┘          │
│       │                                             │
│       │ HTTP (Internal)                            │
│       ▼                                             │
│  ┌─────────────────────────────────────┐          │
│  │      EXPRESS API SERVER(S)          │          │
│  │  (Horizontal scaling possible)      │          │
│  │  - Container: Docker/K8s            │          │
│  │  - Auto-scaling: CPU/Memory         │          │
│  │  - Health checks: /health           │          │
│  └─────────────────────────────────────┘          │
│       │                                             │
│       ├─────────────────┬──────────────┐           │
│       │                 │              │           │
│       ▼                 ▼              ▼           │
│  ┌──────────┐    ┌──────────┐  ┌──────────┐      │
│  │ MongoDB  │    │ AWS S3 / │  │ Ethereum │      │
│  │ Atlas    │    │ Backup   │  │ (Prod)   │      │
│  │ (Cloud)  │    │          │  │ Network  │      │
│  └──────────┘    └──────────┘  └──────────┘      │
│       │                                             │
│       ├─────────────────┬──────────────┐           │
│       │                 │              │           │
│       ▼                 ▼              ▼           │
│  ┌──────────┐    ┌──────────┐  ┌──────────┐      │
│  │ Logging  │    │ Monitor  │  │ Alerts   │      │
│  │ (Stack)  │    │ (Datadog)│  │ (Alert)  │      │
│  └──────────┘    └──────────┘  └──────────┘      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

**Architecture designed for scalability, security, and maintainability**

*Built with microservices principles for future expansion*
