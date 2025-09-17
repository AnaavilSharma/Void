#!/bin/bash

echo "Starting Trace-Bit Servers..."

# Start Django Backend
echo "Starting Django Backend on port 8000..."
cd tracebit_backend
source ../venv/bin/activate
python manage.py runserver 8000 &
BACKEND_PID=$!

# Start Admin Frontend
echo "Starting Admin Frontend on port 3001..."
cd ../tracebit_admin
npm start &
ADMIN_PID=$!

# Start User Frontend
echo "Starting User Frontend on port 3002..."
cd ../tracebit_user
npm start &
USER_PID=$!

echo ""
echo "All servers started!"
echo "Backend API: http://localhost:8000"
echo "Admin Panel: http://localhost:3001"
echo "User Portal: http://localhost:3002"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo "Stopping all servers..."
    kill $BACKEND_PID $ADMIN_PID $USER_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for all background processes
wait
