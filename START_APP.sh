#!/bin/bash

# FLINC Quick Start Script
# This script starts both the backend and frontend servers

echo "🚀 Starting FLINC Application..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if both arguments are provided to start in parallel
if [ "$1" == "all" ]; then
    echo "${BLUE}Starting Backend and Frontend...${NC}"
    
    # Start backend in background
    echo "${GREEN}✓ Starting Backend on port 5001${NC}"
    cd backend
    node src/index.js &
    BACKEND_PID=$!
    
    sleep 3
    
    # Start frontend in background
    echo "${GREEN}✓ Starting Frontend on port 5173${NC}"
    cd ../buro-flinc-app
    npm run dev &
    FRONTEND_PID=$!
    
    echo ""
    echo "${GREEN}✓ Both servers are running!${NC}"
    echo ""
    echo "Backend:  http://localhost:5001"
    echo "Frontend: http://localhost:5173"
    echo ""
    echo "Press Ctrl+C to stop all servers"
    
    # Wait for interrupt
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" INT
    wait
else
    echo "${BLUE}FLINC Quick Start${NC}"
    echo ""
    echo "Usage: Choose which server to start"
    echo ""
    echo "Option 1 - Start Backend Only:"
    echo "  cd backend"
    echo "  node src/index.js"
    echo ""
    echo "Option 2 - Start Frontend Only:"
    echo "  cd buro-flinc-app"
    echo "  npm run dev"
    echo ""
    echo "Option 3 - Start Both:"
    echo "  bash START_APP.sh all"
    echo ""
    echo "Or use two separate terminal windows:"
    echo ""
    echo "Terminal 1 (Backend):"
    echo "  cd backend && node src/index.js"
    echo ""
    echo "Terminal 2 (Frontend):"
    echo "  cd buro-flinc-app && npm run dev"
    echo ""
    echo "Then open: http://localhost:5173/login"
fi

