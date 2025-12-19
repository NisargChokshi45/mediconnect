# Mediconnect Backend - Quick Reference

## Running the Platform

### Start All Services (Docker)

```bash
cd backend
docker-compose up -d
```

### Stop All Services

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f [service-name]
```

## Service Endpoints

| Service             | Port | Health Check                 |
| ------------------- | ---- | ---------------------------- |
| API Gateway         | 3000 | http://localhost:3000/health |
| Auth Service        | 3001 | http://localhost:3001/health |
| Patient Service     | 3002 | http://localhost:3002/health |
| Doctor Service      | 3003 | http://localhost:3003/health |
| Appointment Service | 3004 | http://localhost:3004/health |
| Notes Service       | 3005 | http://localhost:3005/health |

## API Documentation

- Swagger UI: http://localhost:3000/api-docs

## Observability

- Jaeger UI: http://localhost:16686

## Testing the API

### 1. Register a Patient

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password123",
    "role": "PATIENT"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password123",
    "role": "PATIENT"
  }'
```

### 3. Create Patient Profile

```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "userId": "user-id-from-login",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "phone": "+1-555-0101",
    "bloodGroup": "O+"
  }'
```

## Database Access

Each service has its own PostgreSQL database:

- Auth DB: localhost:5432 (mediconnect_auth)
- Patient DB: localhost:5433 (mediconnect_patient)
- Doctor DB: localhost:5434 (mediconnect_doctor)
- Appointment DB: localhost:5435 (mediconnect_appointment)
- Notes DB: localhost:5436 (mediconnect_notes)

## Development

### Run a single service locally

```bash
cd services/auth-service
npm install
cp .env.example .env
npm run dev
```

### Run migrations

```bash
cd services/auth-service
npm run db:migrate
```

### Run tests

```bash
cd services/auth-service
npm test
```

## Architecture

- **Database per Service**: Each microservice has its own PostgreSQL instance
- **API Gateway**: Single entry point at port 3000
- **Inter-Service Auth**: Services validate JWT tokens with auth service
- **Distributed Tracing**: OpenTelemetry + Jaeger
- **PHI-Safe Logging**: Automatic sanitization of sensitive data

## Implemented Services

✅ **Auth Service** - User authentication, JWT generation/verification  
✅ **Patient Service** - Patient CRUD with auth middleware  
✅ **API Gateway** - Request routing, OpenAPI docs  
🔨 **Doctor Service** - Structure ready  
🔨 **Appointment Service** - Structure ready  
🔨 **Notes Service** - Structure ready

## Common Issues

### Port already in use

```bash
# Find process using port
lsof -i :3000
# Kill process
kill -9 PID
```

### Database connection failed

```bash
# Check if PostgreSQL containers are running
docker ps | grep postgres
# Restart containers
docker-compose restart
```

### JWT token expired

- Tokens expire after 24h (configurable in `.env`)
- Re-login to get a new token

## Project Structure

```
backend/
├── docker-compose.yml       # Orchestration
├── shared/                  # Shared utilities
│   ├── logger.ts           # PHI-safe logging
│   └── types.ts            # Common types
└── services/
    ├── auth-service/       # ✅ Complete
    ├── patient-service/    # ✅ Complete
    ├── api-gateway/        # ✅ Complete
    ├── doctor-service/     # 🔨 Ready
    ├── appointment-service/# 🔨 Ready
    └── notes-service/      # 🔨 Ready
```

## Security Notes

- All passwords hashed with bcrypt
- JWT tokens for stateless auth
- RBAC on all protected endpoints
- PHI automatically redacted from logs
- CORS and Helmet.js security headers
- Input validation on all requests
