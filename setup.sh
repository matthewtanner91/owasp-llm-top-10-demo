#!/bin/bash

# Setup script for Vulnerable AI Application

echo "🚀 Setting up Vulnerable AI Application..."
echo "⚠️  WARNING: This application is intentionally vulnerable!"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker."
    exit 1
fi

echo "✅ Docker found"

# Check for Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker Compose found"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Start Docker containers
echo "🐳 Starting Ollama container..."
docker-compose up -d

echo "⏳ Waiting for Ollama to start (30 seconds)..."
sleep 30

# Pull the model
echo "📥 Pulling tinyllama model (fast and lightweight for testing)..."
docker exec vulnerable-ai-ollama ollama pull tinyllama

if [ $? -eq 0 ]; then
    echo "✅ Model downloaded successfully"
else
    echo "❌ Failed to download model"
    echo "You can manually pull it later with: docker exec vulnerable-ai-ollama ollama pull tinyllama"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  npm start"
echo ""
echo "Or for development mode:"
echo "  npm run dev"
echo ""
echo "The API will be available at: http://localhost:3000"
echo ""
echo "⚠️  Remember: This is an intentionally vulnerable application for educational purposes only!"
