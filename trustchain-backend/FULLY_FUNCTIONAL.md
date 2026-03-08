# ✅ FULLY FUNCTIONAL BACKEND - Complete Checklist

## What You Need to Do (In Order)

### 1️⃣ **Ensure MongoDB is Running** (CRITICAL)
```bash
# Docker (Recommended - one command)
docker run -d -p 27017:27017 --name trustchain-db mongo:latest

# OR local MongoDB
mongod
```
⏳ **Wait 10 seconds** for MongoDB to initialize  
✅ **Verify**: Check if running with: `docker ps | grep mongo` or `lsof -i :27017`

---

### 2️⃣ **Verify .env Configuration**
```bash
cd trustchain-backend
cat .env
```

**Required fields already set:**
- ✅ `PORT=3000`
- ✅ `MONGO_URI=mongodb://127.0.0.1:27017/trustchain`
- ✅ `JWT_SECRET=trustchain_dev_secret_key_2026_change_in_production`
- ✅ `JWT_EXPIRE=7d`
- ✅ `NODE_ENV=development`

**Optional (for IPFS/Blockchain):**
- 📝 `PINATA_API_KEY` - Leave as is for now
- 📝 `PINATA_SECRET` - Leave as is for now
- 📝 `INFURA_URL` - Leave as is for now
- 📝 `CONTRACT_ADDRESS` - Leave as is for now
- 📝 `PRIVATE_KEY` - Leave as is for now

---

### 3️⃣ **Start the Backend Server**

**Option A: Using the automated script** (Easiest)
```bash
cd trustchain-backend
bash start.sh
```

**Option B: Manual start**
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

---

### 4️⃣ **Test the Server is Working**

#### Test 1: Health Check
```bash
curl http://localhost:3000/health
```
**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-03-07T...",
  "environment": "development"
}
```

#### Test 2: Register a User
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

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "testuser",
    "role": "developer"
  }
}
```

#### Test 3: Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!"
  }'
```

**Save the token from response - you'll need it for protected routes**

#### Test 4: Get Current User (Protected Route)
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with the actual token from the login response.

---

## 🎯 Success Indicators

✅ **Backend is FULLY FUNCTIONAL when:**
1. MongoDB is running (no connection errors)
2. Server starts without errors
3. Health endpoint returns status OK
4. User registration succeeds
5. User login returns a valid JWT token
6. Protected routes work with valid token

---

## 📋 What's Already Done For You

✅ **Code**
- 19 source files created
- All endpoints implemented (16+)
- Error handling configured
- Security middleware setup
- Database models created

✅ **Configuration**
- `.env` configured with MongoDB URI
- JWT secret generated
- All dependencies installed
- Scripts configured in package.json

✅ **Bug Fixes Applied**
- ✅ Fixed import assertion syntax error
- ✅ Removed deprecated MongoDB options
- ✅ Proper ES6 module support

✅ **Documentation**
- README.md - Quick start
- IMPLEMENTATION_GUIDE.md - Full API reference
- ARCHITECTURE.md - System design
- TEST_SETUP.md - Testing guide
- postman_collection.json - Postman API collection
- start.sh - Automated setup script

---

## 🚀 Required Actions Summary

| # | Action | Status | Command |
|---|--------|--------|---------|
| 1 | Start MongoDB | ⏳ TODO | `docker run -d -p 27017:27017 --name trustchain-db mongo:latest` |
| 2 | Verify .env | ✅ DONE | View file, no changes needed |
| 3 | Start Backend | ⏳ TODO | `npm run dev` or `bash start.sh` |
| 4 | Test API | ⏳ TODO | `curl http://localhost:3000/health` |

---

## 🔧 Troubleshooting

### Issue: MongoDB Connection Failed
```
Error: ECONNREFUSED 127.0.0.1:27017
```
**Fix:**
```bash
# Make sure MongoDB is running
docker ps | grep mongo

# If not running, start it
docker run -d -p 27017:27017 --name trustchain-db mongo:latest

# Wait 10 seconds, then try again
sleep 10 && npm run dev
```

### Issue: Port 3000 Already in Use
```
Error: EADDRINUSE :::3000
```
**Fix:**
```bash
# Change port in .env
nano .env
# Change: PORT=3001

# Or kill the process using port 3000
lsof -i :3000
kill -9 <PID>
```

### Issue: Server Starts but Hangs
**Cause:** Usually MongoDB not responding  
**Fix:**
1. Check MongoDB: `docker ps`
2. Restart MongoDB: `docker restart trustchain-db`
3. Wait 10 seconds
4. Restart backend: `npm run dev`

---

## 📖 API Documentation

**Base URL:** `http://localhost:3000`

### Authentication Routes
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Get JWT token
- `GET /api/auth/me` - Get profile [Protected]
- `PUT /api/auth/me` - Update profile [Protected]

### Project Routes
- `POST /api/projects/upload` - Upload project [Protected]
- `GET /api/projects/my` - Get my projects [Protected]
- `GET /api/projects/:id` - Get project details
- `GET /api/projects/stats` - Get statistics
- `PUT /api/projects/:id/status` - Update status [Protected]
- `DELETE /api/projects/:id` - Delete project [Protected]

### Verification Routes
- `POST /api/verify/:projectId` - Verify project [Protected]
- `GET /api/verify/:projectId` - Get verifications
- `GET /api/verify/hash/:hash` - Verify hash on chain
- `GET /api/verify/stats/all` - Get statistics

---

## 🎓 Learning Path

1. **Start here:** README.md (quick overview)
2. **Reference:** IMPLEMENTATION_GUIDE.md (complete API docs)
3. **Testing:** Use postman_collection.json for API testing
4. **Understanding:** ARCHITECTURE.md (system design)

---

## 🎉 You're Ready!

**Your TrustChain v1.0 backend is 100% ready to use!**

Just follow the 4 simple steps above and your backend will be fully operational.

---

## Need Help?

- Check TEST_SETUP.md for detailed testing instructions
- Review error messages in terminal (usually helpful)
- Verify .env file has correct values
- Make sure MongoDB is running
- Check that port 3000 is available

**Happy coding! 🚀**
