# DevOps Quick Start

This repository now includes a DevOps setup for the main local stack on branch `test-devops`.

## Covered services

- `frontend`
- `backend/ApiGateway`
- `backend/config-server`
- `backend/eureka`
- `backend/microservices/user-service`
- `backend/microservices/courses`
- `backend/microservices/Library`
- `backend/microservices/offer`
- `backend/microservices/events`
- `backend/microservices/ResourceManagement`
- `mongodb`
- `zookeeper`
- `kafka`

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

If you chain commands in PowerShell, use `;` instead of `&&` (older PowerShell versions do not support `&&`):

```powershell
Set-Location path\to\repo; docker compose up -d --build
```

The example file now also includes:

- MySQL database names for `events` and `ResourceManagement`
- MongoDB database name for `offer`
- Kafka bootstrap server and topic defaults

## Start the full stack

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
- Offer Service: `http://localhost:8086`
- API Gateway routes to Offer: `http://localhost:8089/api/offers/**`
- Events Service: `http://localhost:8090`
- API Gateway routes to Events: `http://localhost:8089/api/events/**`
- Resource Management Service: `http://localhost:8094`
- API Gateway routes to Resource Management: `http://localhost:8089/api/rm/resources/**`
- MySQL: `localhost:3306`
- MongoDB: `localhost:27017` inside the Compose network
- Kafka broker: `kafka:9092` inside the Compose network

## Stop the stack

```bash
docker compose down
```

To also remove the database volume:

```bash
docker compose down -v
```

To restart after code or config changes:

```bash
docker compose up --build
```

## CI

GitHub Actions workflow:

- `.github/workflows/ci.yml`

The workflow:

- builds the Angular frontend
- packages all targeted Spring Boot services
- builds Docker images for the full local stack

