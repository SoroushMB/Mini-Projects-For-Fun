#!/bin/bash

echo "========================================="
echo "Teacher CMS MERN Stack - Setup Script"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Backend setup
echo "📦 Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your credentials!"
fi

echo "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully!"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

# Frontend setup
echo ""
echo "📦 Setting up Frontend..."
cd frontend

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi

echo "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully!"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "========================================="
echo "✅ Setup completed successfully!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your MongoDB URI and OpenRouter API key"
echo "2. Start MongoDB (if running locally)"
echo "3. Start the backend: cd backend && npm run dev"
echo "4. Start the frontend: cd frontend && npm run dev"
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
