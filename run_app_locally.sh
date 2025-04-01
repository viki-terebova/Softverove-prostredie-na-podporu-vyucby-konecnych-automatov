#!/bin/bash

# Install frontend dependencies
echo "🔧 Building React frontend..."
cd frontend || exit 1

REINSTALL_DEPS=${REINSTALL_DEPENDENCIES:-true}

if [ "$REINSTALL_DEPS" == "true" ]; then
    echo "📦 Installing frontend dependencies..."
    rm -rf node_modules package-lock.json
    npm cache clean --force
    npm install
fi

npm run build || { echo "❌ React build failed"; exit 1; }

cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
pip install -r requirements.txt

echo "🟢 Starting Flask backend..."
cd backend
export FLASK_ENV=development
python wsgi.py & 
cd ..