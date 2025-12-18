# Mediconnect - Healthcare Appointment & Notes Platform

## Overview

Mediconnect is a production-ready healthcare scheduling and clinical notes platform built with a **true microservices architecture**. The system implements enterprise-grade security, PHI-safe logging, distributed tracing, and comprehensive testing specifically designed for handling Protected Health Information (PHI).

## Architecture

### Microservices Design

The backend is organized as independent microservices, each with its own database following the **Database-per-Service pattern**:

```
┌─────────────────┐
│   API Gateway   │ ← Entry point (Port 3000)
│   (Port 3000)   │   - Request routing
└────────┬────────┘   - Correlation IDs
         │            - OpenAPI docs
         │
    ┌────┴──────────────────────────────┐
    │                                   │
┌───▼──────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌────────┐
│  Auth    │  │ Patient  │  │ Doctor   │  │Appointment│  │ Notes  │
│ Service  │  │ Service  │  │ Service  │  │  Service  │  │Service │
│(Pt 3001) │  │(Pt 3002) │  │(Pt 3003) │  │ (Pt 3004) │  │(Pt3005)│
└────┬─────┘  └─────┬────┘  └────┬─────┘  └─────┬─────┘  └───┬────┘
     │              │             │              │            │
┌────▼─────┐  ┌─────▼────┐  ┌────▼─────┐  ┌─────▼─────┐  ┌──▼─────┐
│   Auth   │  │ Patient  │  │ Doctor   │  │Appointment│  │ Notes  │
│    DB    │  │    DB    │  │    DB    │  │    DB     │  │   DB   │
└──────────┘  └──────────┘  └──────────┘  └───────────┘  └────────┘
```

### Key Features

✅ **True Microservices** - Each service is independently deployable  
✅ **Database per Service** - Separate PostgreSQL databases  
✅ **API Gateway** - Centralized routing and request aggregation  
✅ **TypeORM** - Type-safe database operations  
✅ **Distributed Tracing** - OpenTelemetry + Jaeger integration  
✅ **PHI-Safe Logging** - Automatic sanitization of sensitive data  
✅ **JWT Authentication** - Secure token-based auth with RBAC  
✅ **Type Safety** - TypeScript with Zod validation  
✅ **Correlation IDs** - Request tracing across services  

## Technology Stack

- **Runtime**: Node.js 20.x + TypeScript
- **Framework**: Express.js
- **ORM**: TypeORM
- **Database**: PostgreSQL 16
- **Authentication**: JWT + bcrypt
- **Validation**: Zod schemas
- **Logging**: Winston with PHI sanitization
- **API Docs**: OpenAPI 3.0 + Swagger UI
- **Tracing**: OpenTelemetry + Jaeger
- **Container**: Docker + Docker Compose

## Getting Started

### Quick Start with Docker

```bash
cd backend
docker-compose up -d
```

Access:
- API Gateway: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs
- Jaeger UI: http://localhost:16686

### Local Development

```bash
# Auth Service
cd services/auth-service
npm install
cp .env.example .env
npm run dev

# API Gateway (in another terminal)
cd services/api-gateway
npm install
cp .env.example .env
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user  
- `POST /api/auth/login` - User login  

### Patients
- `POST /api/patients` - Create patient profile
- `GET /api/patients/:id` - Get patient profile

## Healthcare-Specific Engineering

### PHI Protection
- Automatic logging sanitization of sensitive fields
- Audit logging for compliance
- No PHI in error responses
- JWT-based secure authentication

### Security Features
- RBAC (Patient, Doctor, Admin)
- bcrypt password hashing
- Zod input validation
- Helmet.js security headers

## Microservice Patterns

1. **Database per Service** - Each service has its own PostgreSQL database
2. **API Gateway** - Centralized entry point
3. **Service Discovery** - Docker Compose networking
4. **Correlation IDs** - Request tracing
5. **Health Checks** - `/health` on all services
6. **Graceful Shutdown** - Proper cleanup handlers

## Testing

```bash
cd services/auth-service
npm test              # Run tests
npm run test:coverage # With coverage
```

## CI/CD

GitHub Actions pipeline includes:
- Linting
- Testing with coverage
- Docker image builds

## License

MIT
