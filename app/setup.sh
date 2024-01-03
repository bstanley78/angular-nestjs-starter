#!/bin/bash

# Environment-specific variables for development
echo "USERNAME=admin" > .env
echo "PASSWORD=admin" >> .env
echo "JWT_SECRET=your-secret-key" >> .env

# Add other variables as needed

echo "Environment variables for development set in .env"

