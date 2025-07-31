#!/bin/bash

# Recreate Demo Users Script
# Run this if demo users get lost or corrupted

echo "🔄 Recreating demo users..."

# Check if server is running
if ! curl -s http://localhost:3001/health > /dev/null; then
    echo "❌ Server is not running on port 3001"
    echo "Start the server with: npm start"
    exit 1
fi

# Recreate demo users
response=$(curl -s -X POST http://localhost:3001/api/auth/dev/recreate-demo-users \
    -H "Content-Type: application/json")

# Check if successful
if echo "$response" | jq -e '.success' > /dev/null; then
    echo "✅ Demo users recreated successfully!"
    echo ""
    echo "📋 Available demo accounts:"
    echo "$response" | jq -r '.users[] | "• \(.email) (\(.role))"'
    echo ""
    echo "🔑 Passwords:"
    echo "• Admin: admin123"
    echo "• Others: password123"
else
    echo "❌ Failed to recreate demo users"
    echo "$response" | jq -r '.error // "Unknown error"'
    exit 1
fi