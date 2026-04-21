# DevOps Quick Start

This repository now includes a first DevOps setup for the core stack on branch `test-devops`.

## Covered services

- `frontend`
- `backend/ApiGateway`
- `backend/config-server`
- `backend/eureka`
- `backend/microservices/user-service`
- `backend/microservices/courses`
- `backend/microservices/Library`

## Local prerequisites

- Docker Desktop
- Docker Compose

## Environment

Copy the example file and adjust secrets if needed:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## Start the core stack

```bash
docker compose up --build
```

## Exposed ports

- Frontend: `http://localhost:4200`
- API Gateway: `http://localhost:8089`
- Config Server: `http://localhost:9999`
- Eureka: `http://localhost:8761`
- User Service: `http://localhost:8080`
- Courses Service: `http://localhost:8081`
- Library Service: `http://localhost:8082`
- MySQL: `localhost:3306`

## Stop the stack

```bash
docker compose down
```

To also remove the database volume:

```bash
docker compose down -v
```

## CI

GitHub Actions workflow:

- `.github/workflows/ci.yml`

The workflow:

- builds the Angular frontend
- packages the Spring Boot core services
- builds Docker images for the core stack
