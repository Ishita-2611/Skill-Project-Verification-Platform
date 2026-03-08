#!/bin/bash

# TrustChain v1.0 Backend Setup Script
# This script helps you get the backend running quickly

set -e

echo "🚀 TrustChain v1.0 Backend Setup"
echo "================================="
echo ""

# Check Node.js version
NODE_VERSION=$(node -v | cut -dt -f2 | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v)"

# Check npm
echo "✅ npm $(npm -v)"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  .env file not found"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "🔑 Please edit .env with your configuration:"
    echo "   - PINATA_API_KEY"
    echo "   - PINATA_SECRET"
    echo "   - INFURA_URL"
    echo "   - CONTRACT_ADDRESS"
    echo "   - PRIVATE_KEY"
    echo "   - JWT_SECRET"
else
    echo "✅ .env file exists"
fi

# Check MongoDB
echo ""
echo "🔍 Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB CLI found"
    echo "   To start MongoDB: mongod"
else
    echo "⚠️  MongoDB not found locally"
    echo "   Option 1: Install MongoDB locally"
    echo "   Option 2: Use Docker: docker run -d -p 27017:27017 mongo:latest"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📖 Next steps:"
echo "   1. Edit .env with your credentials"
echo "   2. Start MongoDB (mongod or Docker)"
echo "   3. Run: npm run dev"
echo "   4. Visit: http://localhost:3000/health"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Quick start guide"
echo "   - IMPLEMENTATION_GUIDE.md - Full API documentation"
echo "   - postman_collection.json - Import to Postman"
echo ""
