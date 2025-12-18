# Mediconnect Microservices

This directory contains the microservice-based backend for the Mediconnect healthcare platform.

## Architecture

The backend is organized as independent microservices:

- **services/api-gateway** - API Gateway for routing and request aggregation
- **services/auth-service** - Authentication and user management
- **services/patient-service** - Patient registration and profile management
- **services/doctor-service** - Doctor registration and profile management
- **services/appointment-service** - Appointment scheduling and management
- **services/notes-service** - Clinical notes management
- **shared** - Shared types, utilities, and constants

## Running Services

Each service can be run independently:

```bash
cd services/auth-service && npm run dev
cd services/patient-service && npm run dev
cd services/doctor-service && npm run dev
cd services/appointment-service && npm run dev
cd services/notes-service && npm run dev
cd services/api-gateway && npm run dev
```

Or use Docker Compose to run all services:

```bash
docker-compose up
```

## Service Ports

- API Gateway: 3000
- Auth Service: 3001
- Patient Service: 3002
- Doctor Service: 3003
- Appointment Service: 3004
- Notes Service: 3005
