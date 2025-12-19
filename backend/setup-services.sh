#!/bin/bash

# Mediconnect Services Quick Setup Script

echo "Setting up all Mediconnect microservices..."

# Services to setup
SERVICES=("auth-service" "patient-service" "doctor-service" "appointment-service" "notes-service" "api-gateway")

for service in "${SERVICES[@]}"; do
  echo "Setting up $service..."
  cd services/$service
  
  # Install dependencies
  if [ -f "package.json" ]; then
    npm install
  fi
  
  # Copy environment file
  if [ -f ".env.example" ]; then
    cp .env.example .env
  fi
  
  cd ../..
done

echo "All services setup complete!"
echo ""
echo "Next steps:"
echo "1. Start Docker Compose: docker-compose up -d"
echo "2. Access API Gateway: http://localhost:3000"
echo "3. View API Docs: http://localhost:3000/api-docs"
echo "4. View Jaeger: http://localhost:16686"
