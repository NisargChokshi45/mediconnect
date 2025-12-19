# Mediconnect Backend - Microservices Architecture

## Overview

This is a **true microservices architecture** with each service being independently deployable with its own database.

## Services

All services are located in the `services/` directory:

- **auth-service** (Port 3001) - User authentication and JWT management
- **patient-service** (Port 3002) - Patient profile management
- **doctor-service** (Port 3003) - Doctor profile management
- **appointment-service** (Port 3004) - Appointment scheduling with circuit breaker
- **notes-service** (Port 3005) - Clinical notes (SOAP format)
- **api-gateway** (Port 3000) - API Gateway with routing and OpenAPI docs

## Quick Start

### Run All Services with Docker Compose

```bash
docker-compose up -d
```

This starts:

- All 6 microservices
- 5 PostgreSQL databases (one per service)
- Jaeger for distributed tracing

### Access Points

- **API Gateway**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **Jaeger UI**: http://localhost:16686

### Run Individual Service Locally

```bash
cd services/auth-service
npm install
cp .env.example .env
npm run dev
```

## Development

Each service is a standalone Node.js + TypeScript application with:

- Its own `package.json` and dependencies
- Its own TypeORM configuration and database
- Its own tests
- Its own Dockerfile

## Project Structure

```
backend/
├── docker-compose.yml       # Orchestrates all services
└── services/
    ├── auth-service/        # ✅ Complete
    ├── patient-service/     # ✅ Complete
    ├── doctor-service/      # ✅ Complete
    ├── appointment-service/ # ✅ Complete (with circuit breaker)
    ├── notes-service/       # ✅ Complete (SOAP format)
    └── api-gateway/         # ✅ Complete (OpenAPI docs)
```

## Documentation

See individual service README files and:

- [QUICK_START.md](./QUICK_START.md) - Quick start guide with API examples
- [SERVICES_STATUS.md](./SERVICES_STATUS.md) - Complete implementation status
- [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) - Full implementation walkthrough

## Next Steps

1. Run `docker-compose up -d` to start all services
2. Access API docs at http://localhost:3000/api-docs
3. Test the API using the examples in QUICK_START.md
4. For production: Implement testing, add metrics, deploy to AWS ECS
