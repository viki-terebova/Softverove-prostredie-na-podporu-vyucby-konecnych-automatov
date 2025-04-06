#!/bin/bash

cd "$(dirname "$0")"

echo "🔧 Setting up Python backend..."

# Load .env if present
[ -f ".env" ] && export $(grep -v '^#' .env | xargs)

# Create and activate virtual environment (cross-platform)
if [ ! -d ".venv" ]; then
  echo "📦 Creating Python virtual environment..."
  python -m venv .venv
fi

if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  source .venv/Scripts/activate
else
  source .venv/bin/activate
fi

pip install -r requirements.txt

export FLASK_ENV=development
export FLASK_APP=backend/wsgi.py

echo "🚀 Starting Flask backend on port 5000..."
# Run Flask in background, but no need to track PID
python "$FLASK_APP" &

# -------- Frontend --------
echo "🔧 Setting up React frontend..."
cd frontend
npm install

echo "🧪 Running sanity checks..."
if ! grep -q '<div id="root">' "index.html"; then
  echo "❌ ERROR: Missing <div id=\"root\"> in index.html"
  exit 1
fi

echo "🌐 Starting Vite React frontend on port 3000 (or next)..."
npm run dev

echo "✅ App is running!"
