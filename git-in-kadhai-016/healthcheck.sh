#!/bin/sh
# Health check script for DevPulse

# Check if the server is responding
if wget --quiet --tries=1 --spider http://localhost:3000; then
    echo "✅ DevPulse is healthy and running on port 3000"
    exit 0
else
    echo "❌ DevPulse health check failed"
    exit 1
fi
