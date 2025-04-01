#!/bin/bash

echo "⭐ Starting FiniAutoma locally (without Docker)..."

if [ ! -d ".venv" ]; then
    echo "⚠️ Virtual environment not found! Creating one..."
    python -m venv .venv
fi

echo "🟢 Activating virtual environment..."
if [[ "$OSTYPE" == "linux-gnu"* || "$OSTYPE" == "darwin"* ]]; then
    source .venv/bin/activate
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
    source .venv/Scripts/activate
else
    echo "❌ Unsupported OS: $OSTYPE"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
pip install -r requirements.txt

echo "🟢 Starting Flask backend..."
cd backend
export FLASK_ENV=development
python wsgi.py & 
cd ..

# Ensure frontend dependencies are installed
echo "🟢 Starting React frontend..."
cd frontend

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Default to false if the variable is not set
REINSTALL_DEPS=${REINSTALL_DEPENDENCIES:-false}

# Check if node_modules directory or react-scripts is missing OR env variable is true
if [ "$REINSTALL_DEPS" == "true" ]; then
    echo "📦 Installing frontend dependencies..."
    rm -rf node_modules package-lock.json
    npm cache clean --force
    npm install
fi

npm start & 

echo "✅ FiniAutoma is running locally!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://127.0.0.1:5000"

wait
