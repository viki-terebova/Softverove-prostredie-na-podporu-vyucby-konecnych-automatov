#!/bin/bash

echo "🚀 Starting FiniAutoma locally (without Docker)..."

if [ ! -d ".venv" ]; then
    echo "⚠️ Virtual environment not found! Creating one..."
    python -m venv .venv
fi

echo "🟢 Starting Flask backend..."
cd backend

if [[ "$OSTYPE" == "linux-gnu"* || "$OSTYPE" == "darwin"* ]]; then
    source backend/venv/bin/activate
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
    source backend/venv/Scripts/activate 
else
    echo "❌ Unsupported OS: $OSTYPE"
    exit 1
fi

pip install -r ../requirements.txt

export FLASK_ENV=development
python wsgi.py & 

cd ..

echo "🟢 Starting React frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

npm start & 

echo "✅ FiniAutoma is running locally!"
echo "🌍 Frontend: http://localhost:3000"
echo "📡 Backend: http://127.0.0.1:5000"

wait