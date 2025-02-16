#!/bin/bash

# Step 1: Ensure the network exists
docker network ls | grep "app-network" > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Creating network: app-network"
  docker network create app-network
else
  echo "Network app-network already exists"
fi

# Step 2: Start all services
echo "Starting services..."
docker-compose up --build -d

# Step 3: Ensure services are connected to the network
echo "Connecting services to app-network..."
docker network connect app-network auth-service
docker network connect app-network product-service
docker network connect app-network frontend-service

echo "All services are up and connected!"
