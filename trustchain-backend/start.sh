#!/bin/bash
# 🚀 TrustChain Backend - Complete Quick Start Guide
# This script will help you get the backend running

echo "🚀 TrustChain v1.0 Backend - Quick Start"
echo "========================================"
echo ""

# Step 1: Check MongoDB
echo "Step 1: Checking MongoDB..."
if docker ps | grep -q mongo; then
    echo "✅ MongoDB is running"
else
    echo "⏳ MongoDB not running. Starting..."
    docker run -d -p 27017:27017 --name trustchain-db mongo:latest
    echo "⏳ Waiting for MongoDB to initialize (10 seconds)..."
    sleep 10
    echo "✅ MongoDB started"
fi

# Step 2: Navigate to backend
echo ""
echo "Step 2: Navigating to backend directory..."
cd trustchain-backend || exit 1
echo "✅ In trustchain-backend directory"

# Step 3: Verify .env exists
echo ""
echo "Step 3: Checking environment configuration..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    echo "📝 Current configuration:"
    grep -E "^(PORT|MONGO_URI|NODE_ENV)" .env
else
    echo "⚠️  .env file not found. Creating from example..."
    cp .env.example .env
    echo "✅ .env created"
fi

# Step 4: Install dependencies
echo ""
echo "Step 4: Installing dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ Dependencies already installed"
else
    npm install
    echo "✅ Dependencies installed"
fi

# Step 5: Start server
echo ""
echo "Step 5: Starting Express server..."
echo "🚀 Starting with: npm run dev"
echo ""
echo "Expected output in next 3 seconds:"
echo "  ✅ MongoDB Connected: 127.0.0.1"
echo "  ✅ Blockchain service initialized"
echo "  🚀 Server running on port 3000"
echo ""

npm run dev &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

# Step 6: Wait and test
echo ""
echo "Step 6: Testing server..."
sleep 4

echo ""
echo "🧪 Testing Health Endpoint:"
curl -s http://localhost:3000/health | jq . || curl -s http://localhost:3000/health

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "📋 Available Endpoints:"
echo "  GET    /health                          - Server health check"
echo "  POST   /api/auth/register              - Register new user"
echo "  POST   /api/auth/login                 - Login user"
echo "  GET    /api/auth/me                    - Get current user [Protected]"
echo "  POST   /api/projects/upload            - Upload project [Protected]"
echo "  GET    /api/projects/my                - Get my projects [Protected]"
echo "  GET    /api/projects/stats             - Get statistics"
echo ""
echo "🔗 API Base URL: http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "  - README.md             - Quick start guide"
echo "  - IMPLEMENTATION_GUIDE.md - Complete API reference"
echo "  - ARCHITECTURE.md       - System architecture"
echo "  - TEST_SETUP.md         - Testing guide"
echo ""
echo "💡 TIPS:"
echo "  - To test API: curl http://localhost:3000/health"
echo "  - Import postman_collection.json to Postman"
echo "  - Use Ctrl+C to stop the server"
echo ""
echo "🎉 Your TrustChain backend is ready!"
