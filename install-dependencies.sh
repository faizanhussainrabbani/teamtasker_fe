#!/bin/bash

# Install dependencies
npm install @tanstack/react-query @tanstack/react-query-devtools axios
npm install -D msw

# Create public/mockServiceWorker.js for MSW
npx msw init public/ --save

echo "Dependencies installed successfully!"
