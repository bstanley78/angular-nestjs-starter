#!/bin/bash

# Run Docker Compose
docker-compose down
docker-compose up --build -d

# Wait for services to start (you can adjust the sleep duration)
sleep 1

# Run UI local
cd ui && npm start
