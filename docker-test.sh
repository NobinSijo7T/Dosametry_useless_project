#!/bin/bash

# Docker Test Script for Dosametry
# Run this to test your Docker build locally before deploying to Railway

set -e

echo "🐳 Dosametry Docker Build & Test Script"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Build Docker image
echo -e "${BLUE}📦 Building Docker image...${NC}"
docker build -t dosametry:test .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo ""

# Run container
echo -e "${BLUE}🚀 Starting container...${NC}"
docker run -d -p 3000:3000 --name dosametry-test dosametry:test

# Wait for container to start
sleep 5

# Check health
echo ""
echo -e "${BLUE}🏥 Checking health endpoint...${NC}"
HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Health check passed!${NC}"
    echo "$HEALTH_RESPONSE"
else
    echo -e "${RED}❌ Health check failed!${NC}"
    docker logs dosametry-test
    docker stop dosametry-test
    docker rm dosametry-test
    exit 1
fi

echo ""
echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""
echo -e "${BLUE}📊 Container info:${NC}"
docker ps | grep dosametry-test

echo ""
echo -e "${BLUE}💡 Next steps:${NC}"
echo "  1. Open http://localhost:3000 in your browser"
echo "  2. Test the application"
echo "  3. When done, stop container:"
echo "     ${GREEN}docker stop dosametry-test${NC}"
echo "     ${GREEN}docker rm dosametry-test${NC}"
echo ""
echo -e "${BLUE}🚂 Ready to deploy to Railway!${NC}"
